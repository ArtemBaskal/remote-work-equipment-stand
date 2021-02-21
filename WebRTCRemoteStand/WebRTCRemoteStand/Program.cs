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
using MicrocontrollerAPI;
using System.Text.Json;


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



            //var instance = Quartus_console.GetInstance();
            //Console.WriteLine(instance.path_to_quartus);

            //var task = instance.RunQuartusCommandAsync("quartus_pgm -m jtag –o \"p;DE10_LITE_Golden_Top.sof@1\"");



            //WebCam camera = WebCam.GetInstance();
            //Console.WriteLine(WebRTCPeer.ConvertString("{\"data\":{\"candidate\":{\"candidate\":\"candidate:1387637174 1 udp 2122260223 192.168.0.39 55376 typ host generation 0 ufrag dUjV network-id 1 network-cost 10\",\"sdpMid\":\"0\",\"sdpMLineIndex\":0}}}"));
            //Console.WriteLine(CreateSignalingServerUrl());

            //string JsonMessage = "{\"command_type\":4, \"pin_number\":2, \"duty\":234, \"frequency\":324}";

            //Console.WriteLine($"Before serialization: {JsonMessage}");

            //CTP_packet p = JsonSerializer.Deserialize<CTP_packet>(JsonMessage);

            //Console.WriteLine("After serialization:");
            //Console.WriteLine($"command_type: {p.command_type}, pin_number: {p.pin_number}, duty: {p.duty}, frequency: {p.frequency}");

            //Microcontroller controller = Microcontroller.Get_instance();
            //char key = 'a';
            //while (key != 'q')
            //{
            //    Console.Write("Input command type:");
            //    p.command_type = Convert.ToByte(Convert.ToInt32(Console.ReadLine()));
            //    Console.Write("Input pin_number:");
            //    p.pin_number = Convert.ToByte(Convert.ToInt32(Console.ReadLine()));
            //    Console.Write("Input duty:");
            //    p.duty = Convert.ToByte(Convert.ToInt32(Console.ReadLine()));
            //    Console.Write("Input frequency:");
            //    p.frequency = Convert.ToUInt32(Convert.ToUInt32(Console.ReadLine()));

            //    Console.WriteLine($"command_type: {p.command_type}, pin_number: {p.pin_number}, duty: {p.duty}, frequency: {p.frequency}");
            //    Console.WriteLine(controller.SendCTP_Command(p));

            //    Console.Write("Input q to stop or other to continue:");
            //    key = Console.ReadLine()[0];
            //}

            //controller.Close();

        }
    }
}
