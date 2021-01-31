using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Serilog;
using Serilog.Extensions.Logging;
using SIPSorcery.Media;
using SIPSorcery.Net;
using SIPSorceryMedia.Encoders;
using SIPSorceryMedia.FFmpeg;
using SIPSorceryMedia.Windows;
using WebSocketSharp.Server;

namespace WebRTCRemoteStand
{
    class WebRTCPeer
    {
        // Working with sdp and ice candidate messages
        public static string ConvertString(string JsonStr) {
            // Чистим до 3 скобочки и убираем последнюю
            // num - до какого номера вхождения
            int num = 3;
            //JsonStr.TakeWhile(c => (num -= (c == '{' ? 1 : 0)) > 0).Count());
            JsonStr = JsonStr.Substring(JsonStr.TakeWhile(c => (num -= (c == '{' ? 1 : 0)) > 0).Count());
            JsonStr = JsonStr.Substring(0, JsonStr.Length - 2);
            return JsonStr;
        }
        private static RTCPeerConnection BuildRTCPeerInstance(List<RTCIceServer> ice_candidates) {
            RTCConfiguration config = new RTCConfiguration
            {
                iceServers = ice_candidates
            };
            return new RTCPeerConnection(config);
        }

        private async void Negotiate() {
            if (isOfferCreated == false)
            {
                createdOffer = pc.createOffer(new RTCOfferOptions());
                await pc.setLocalDescription(createdOffer);
                isOfferCreated = true;
            }
            signaling.Send("{\"data\":{\"description\":" + createdOffer.toJSON() + "}}");
        }

        private Microsoft.Extensions.Logging.ILogger logger { get; set; }

        static private Microsoft.Extensions.Logging.ILogger CreateLogger() {
            var serilogLogger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .MinimumLevel.Is(Serilog.Events.LogEventLevel.Debug)
                .WriteTo.Console()
                .CreateLogger();
            var factory = new SerilogLoggerFactory(serilogLogger);
            SIPSorcery.LogFactory.Set(factory);
            return factory.CreateLogger<Program>();
        }

        // Signaling method through the websockets (WebSocketSharp.Server)
        private WebSocketSharp.WebSocket signaling { get; set; }
        private RTCPeerConnection pc {get; set;}
        private bool isOfferCreated { get; set; }
        private WebCam camera;
        private RTCSessionDescriptionInit createdOffer { get; set; }

        private void AddActionsToRTCPeer()
        {
            pc.onicecandidate += (candidate) =>
            {
                signaling.Send("{\"data\":{\"candidate:\"" + candidate.toJSON() + "}}");
            };

            pc.oniceconnectionstatechange += (ice) =>
            {
                if (pc.iceConnectionState == RTCIceConnectionState.failed) {
                    pc.restartIce();
                }
            };

            pc.onnegotiationneeded += Negotiate;

            pc.onconnectionstatechange += (state) =>
            {
                logger.LogDebug($"Peer connection state change to {state}.");

                if (state == RTCPeerConnectionState.connected)
                {
                    logger.LogDebug($"Start streaming on peer");
                    camera.StartVideo();
                }
                else if (state == RTCPeerConnectionState.failed)
                {
                    pc.Close("Failed to connect");
                }
                else if (state == RTCPeerConnectionState.disconnected)
                {
                    camera.StopVideo();
                }
                else if (state == RTCPeerConnectionState.connecting)
                {
                    logger.LogDebug("Peer conneting");
                }
                else if (state == RTCPeerConnectionState.@new) {
                    logger.LogDebug("Peer new");
                }
                else {
                    logger.LogDebug("Peer closed");
                }
            };

            // Diagnostics.
            pc.OnReceiveReport += (re, media, rr) => logger.LogDebug($"RTCP Receive for {media} from {re}\n{rr.GetDebugSummary()}");
            pc.OnSendReport += (media, sr) => logger.LogDebug($"RTCP Send for {media}\n{sr.GetDebugSummary()}");
            pc.GetRtpChannel().OnStunMessageReceived += (msg, ep, isRelay) => logger.LogDebug($"STUN {msg.Header.MessageType} received from {ep}.");
            pc.oniceconnectionstatechange += (state) => logger.LogDebug($"ICE connection state change to {state}.");
        }
        private void AddWebCamVideoTrack() {

            pc.addTrack(new MediaStreamTrack(camera.GetCurrentSourceVideoFormats(), MediaStreamStatusEnum.SendOnly));

            camera.SetOnVideoSourceEncodedSampleAction(pc.SendVideo);

            pc.OnVideoFormatsNegotiated += (videoformats) =>
            {
                camera.SetVideoSourceFormat(videoformats.First());
            };


        }
        private void AddActionsToSignalingWebSocket()
        {
            signaling.OnMessage += (sender, message) =>
            {
                logger.LogDebug($"Received message: {message.Data}");
                if (message.Data == "{\"data\":{\"getRemoteMedia\":true}}") {
                    Negotiate();
                    return;
                }
                if(message.Data == "{\"data\":{\"candidate\":null}}"){
                    return;
                }
                string correct_message = ConvertString(message.Data);
                logger.LogDebug($"After nesting:{correct_message}");
                if (RTCIceCandidateInit.TryParse(correct_message, out var IceCandidate))
                {
                    logger.LogDebug($"Got remote candidate: {correct_message}");
                    pc.addIceCandidate(IceCandidate);
                }
                else if (RTCSessionDescriptionInit.TryParse(correct_message, out var SDP)) {
                    logger.LogDebug($"Setting SDP: {correct_message}");
                    var result = pc.setRemoteDescription(SDP);
                    if (result != SetDescriptionResultEnum.OK) {
                        logger.LogWarning($"Failed to set remote description, {result}.");
                        pc.Close("failed to set remote description");
                    }
                }
            };
        }

        public WebRTCPeer(string signaling_url, List<RTCIceServer> ice_candidates) {
            // Creating logger
            logger = CreateLogger();

            // Create camera instance
            camera = WebCam.GetInstance();


            // Create websocket for connection to signaling server
            signaling = new WebSocketSharp.WebSocket(signaling_url);
            signaling.Connect();
            AddActionsToSignalingWebSocket();

            // Creating RTCPeerConnection
            pc = BuildRTCPeerInstance(ice_candidates);
            AddActionsToRTCPeer();
            AddWebCamVideoTrack();


        }

        public void StartPeerConnection() {
            

            ManualResetEvent exitMre = new ManualResetEvent(false);
            Console.CancelKeyPress += delegate (object sender, ConsoleCancelEventArgs e)
            {
                e.Cancel = true;
                exitMre.Set();
            };

            // Wait for a signal saying the call failed, was cancelled with ctrl-c or completed.
            exitMre.WaitOne();
        }

    }
}
