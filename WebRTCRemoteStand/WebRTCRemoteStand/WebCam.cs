using System;
using System.Collections.Generic;
using System.Text;
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
using SIPSorceryMedia.Abstractions;

namespace WebRTCRemoteStand
{
    class WebCam
    {
        private WebCam() {
            _video_end_point  = new WindowsVideoEndPoint(new VpxVideoEncoder(), WebCamName);
            //WindowsVideoEndPoint winVideoEP = new WindowsVideoEndPoint(new FFmpegVideoEncoder(), WEBCAM_NAME);
            //WindowsVideoEndPoint winVideoEP = new WindowsVideoEndPoint(WEBCAM_NAME, 1920, 1080, 30);
            //winVideoEP.RestrictFormats(x => x.Codec == SIPSorceryMedia.Abstractions.V1.VideoCodecsEnum.H264);
            bool initResult = _video_end_point.InitialiseVideoSourceDevice().Result;
            if (!initResult)
            {
                throw new ApplicationException("Could not initialise video capture device.");
            }
        }
        private static WindowsVideoEndPoint _video_end_point { get; set; }
        private static string WebCamName { get; set; } = "Default";

        private static WebCam _instance;

        // Method to set VideoFormat
        public void SetVideoSourceFormat(VideoFormat _videoFormat) {
            _video_end_point.SetVideoSourceFormat(_videoFormat);
        }

        // What encoding use (set Action for encoding)
        public void SetOnVideoSourceEncodedSampleAction(EncodedSampleDelegate _videoSender) {
            _video_end_point.OnVideoSourceEncodedSample += _videoSender;
        }

        // Returned current video formats of source
        public List<VideoFormat> GetCurrentSourceVideoFormats() {
            return _video_end_point.GetVideoSourceFormats();
        }

        public Task<Task> StartVideoAsync() {
            return Task.FromResult(_video_end_point.StartVideo());
        }
        public Task<Task> StopVideoAsync() {
           return Task.FromResult( _video_end_point.CloseVideo());
        }
        public async void StartVideo()
        {
            await _video_end_point.StartVideo();
        }
        public async void StopVideo()
        {
            await _video_end_point.CloseVideo();
        }

        public static WebCam GetInstance() {
            if (_instance == null || _video_end_point == null) {
                _instance = new WebCam();
            }
            
            return _instance;
        }

        public void DisposeVideoCamera() {
            _video_end_point.Dispose();
        }



    }
}
