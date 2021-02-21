using System;
using System.IO.Ports;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Serilog;
using Serilog.Extensions.Logging;
using Microsoft.Extensions.Logging;

namespace MicrocontrollerAPI
{
    public class Pin_Setting {
        public Pin_Setting() {
            button_number = signal_level = duty = frequency = -1;
            PWM_signal_status = false;
        }
        public int button_number { get; set; }
        public bool PWM_signal_status { get; set; }
        public int signal_level { get; set; }
        public int duty {get; set;}
        public int frequency { get; set; }
    }
    public class Ids_Usings_Pins {
        // input GPIO_0[0] on FPGA = LEDDR[0] - output pin number Arduino 11 - PWM
        // input GPIO_0[2] on FPGA = LEDDR[1] - output pin number Arduino 10 - PWM
        // input GPIO_0[4] on FPGA = LEDDR[2] - output pin number Arduino 9 - PWM
        // input GPIO_0[6] on FPGA = LEDDR[3] - output pin number Arduino 8
        // input GPIO_0[10] on FPGA = LEDDR[4] - output pin number Arduino 5 - PWM
        // input GPIO_0[12] on FPGA = LEDDR[5] - output pin number Arduino 4
        // input GPIO_0[14] on FPGA = LEDDR[6] - output pin number Arduino 3 - PWM
        // input GPIO_0[16] on FPGA = LEDDR[7] - output pin number Arduino 2
        static public readonly Dictionary<int, int> Using_Digital_GPIO_Arduino_Outputs = new Dictionary<int, int>{ 
            {0, 11}, 
            {1, 10}, 
            {2, 9}, 
            {3, 8}, 
            {4, 5}, 
            {5, 4}, 
            {6, 3}, 
            {7, 2} 
        };
    }
    public enum Digital_Signal_Levels {
        LOW,
        HIGH
    }
    public class Digital_GPIO_Output {
        public Digital_GPIO_Output() { }
        public Digital_GPIO_Output(int _pin_number, Digital_Signal_Levels _signal_level) {
            pin_number = _pin_number;
            signal_level = _signal_level;
        }
        public int pin_number { get; set; }
        public Digital_Signal_Levels signal_level { get; set; }
    }
    public class Pins_Status {
        public Pins_Status() {
            pins = new List<Digital_GPIO_Output>();
            type_of_pins = typeof(Digital_GPIO_Output).ToString();
        }
        public string type_of_pins { get; private set; }
        public List<Digital_GPIO_Output> pins { get; private set; }
        public void AddPinLevel(int FPGA_input_number, Digital_Signal_Levels signal_level) {
            pins.Add(new Digital_GPIO_Output(FPGA_input_number, signal_level));
        }
    }
    public struct CTP_packet
    {
        public byte command_type { set; get; }
        public byte pin_number { set; get; }
        public byte duty { set; get; }
        public uint frequency { set; get; }
    }
    public class Microcontroller : IDisposable
    {
        private static SerialPort connection { get; set; }
        private static CTP_packet command;
        private static Microcontroller instance;
        private static Microsoft.Extensions.Logging.ILogger logger { get; set; }

        static public byte[] CommandStruct_to_Bytes(CTP_packet command) {
            byte[] arr = new byte[Marshal.SizeOf(command)];
            IntPtr ptr = Marshal.AllocHGlobal(Marshal.SizeOf(command));
            Marshal.StructureToPtr(command, ptr, true);
            Marshal.Copy(ptr, arr, 0, Marshal.SizeOf(command));
            Marshal.FreeHGlobal(ptr);
            return arr;
        }
        static private bool Check_phisically_connected()
        {
            command = new CTP_packet();
            const int number_of_ports_to_check = 6;
            bool is_connected = false;
            byte[] buffer = new byte[1];
            // Expected response - Unxepected pin
            command.command_type = 1;
            command.pin_number = 255;
            command.duty = 0;
            command.frequency = 0;
            for (int port_number = number_of_ports_to_check; port_number > 0; port_number--) {
                connection.PortName = "COM" + port_number.ToString();
                try
                {
                    connection.Open();
                    connection.Write(CommandStruct_to_Bytes(command), 0, Marshal.SizeOf(command) - 1);
                    connection.Read(buffer, 0, 1);
                }
                catch (Exception) {
                    connection.Close();
                    continue;
                }
                //Console.WriteLine($"Comparison result: {string.Compare(response, expected_response)}");
                if (Convert.ToInt32(buffer[0]) == 101)
                {
                    //Console.WriteLine("Arduino connected!!!");
                    is_connected = true;
                    break;
                }
                connection.Close();
            }
            return is_connected;
                
        }
        private Microcontroller() {
            connection = new System.IO.Ports.SerialPort();
            connection.BaudRate = 9600;
            connection.Parity = System.IO.Ports.Parity.None;
            connection.StopBits = System.IO.Ports.StopBits.One;
            connection.DataBits = 8;
            connection.ReadTimeout = 300;

            //Check_phisically_connected();
            //Console.WriteLine("Here building and connected Arduino");
            if (Check_phisically_connected() == false)
            {
                //Console.WriteLine("Microcontroller device not found.");
                throw new Exception("Microcontroller device not found.");
            }
            else
            {
                logger?.LogDebug("Arduino connection opened!!!");
            }
        }

        static public Microcontroller Create(Microsoft.Extensions.Logging.ILogger logger_for_debug = null) {
            if (instance == null) {
                instance = new Microcontroller();
                logger = logger_for_debug;
            }

            return instance;
        }

        public byte SendCTP_Command(CTP_packet _command) {
            if (connection.IsOpen == false)
            {
                return Convert.ToByte(0);
            }
            connection.Write(CommandStruct_to_Bytes(_command), 0, Marshal.SizeOf(_command) - 1);
            byte[] buffer = new byte[1];
            connection.Read(buffer, 0, 1);
            //Console.WriteLine($"Recieved after command: {Convert.ToInt32(buffer[0])}");
            logger?.LogDebug($"Recieved after command: {Convert.ToInt32(buffer[0])}");
            return buffer[0];
        }
        public Task<byte> SendCTP_CommandAsync(CTP_packet _command) {
            return Task.Factory.StartNew((command) => {
                if (connection.IsOpen == false)
                {
                    return Convert.ToByte(0);
                }
                CTP_packet p = (CTP_packet)command;
                connection.Write(CommandStruct_to_Bytes(p), 0, Marshal.SizeOf(p) - 1);
                byte[] buffer = new byte[1];
                connection.Read(buffer, 0, 1);
                //Console.WriteLine($"Recieved after command: {Convert.ToInt32(buffer[0])}");
                logger?.LogDebug($"Recieved after command: {Convert.ToInt32(buffer[0])}");
                return buffer[0];
            }, _command);
        }

        public void Close()
        {
            Dispose();
        }

        public void Dispose()
        {
            logger?.LogDebug("Close Serial Port Connection by Disposable");
            connection?.Close();
        }
    }
}
