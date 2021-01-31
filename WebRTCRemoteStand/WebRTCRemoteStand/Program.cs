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
    class Program
    {
        static string CreateSignalingServerUrl() {
            Console.WriteLine("Input room number:");
            return $"wss://wss-signaling.herokuapp.com?room={Convert.ToInt32(Console.ReadLine())}";
        }
        
        static void Main(string[] args)
        {
            List<RTCIceServer> ice_candidates = new List<RTCIceServer>(){
                new RTCIceServer { urls = "stun:stun.l.google.com:19302" },
                new RTCIceServer { urls = "stun:stun1.l.google.com:19302" },
                new RTCIceServer { urls = "stun:stun2.l.google.com:19302" },
                new RTCIceServer { urls = "stun:stun3.l.google.com:19302" },
                new RTCIceServer 
                { 
                    urls = "turn:numb.viagenie.ca",
                    credential = "9u7prU:2}R{Sut~.)d[bP7,;Pgc\'Pa",
                    username = "fkrveacbukypqsqyaq@miucce.com"
                }
            };

            WebRTCPeer connection = new WebRTCPeer(CreateSignalingServerUrl(), ice_candidates);
            connection.StartPeerConnection();


            //WebCam camera = WebCam.GetInstance();
            //Console.WriteLine(WebRTCPeer.ConvertString("{\"data\":{\"candidate\":{\"candidate\":\"candidate:1387637174 1 udp 2122260223 192.168.0.39 55376 typ host generation 0 ufrag dUjV network-id 1 network-cost 10\",\"sdpMid\":\"0\",\"sdpMLineIndex\":0}}}"));
            //Console.WriteLine(CreateSignalingServerUrl());

        }
    }
}
