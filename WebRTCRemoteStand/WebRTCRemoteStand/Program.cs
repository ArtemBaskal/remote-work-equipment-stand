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
        
        static void Main(string[] args)
        {
            WebCam camera = WebCam.GetInstance();
            Console.WriteLine("Hello World!");
        }
    }
}
