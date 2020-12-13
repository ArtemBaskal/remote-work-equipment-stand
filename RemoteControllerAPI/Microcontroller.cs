using System;
using System.IO.Ports;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Collections.Generic;
using System.Net.Http;
using System.Runtime.InteropServices;

namespace RemoteStandAPI
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
        public byte command_type;
        public byte pin_number;
        public byte duty;
        public uint frequency;
    }
    public class Microcontroller
    {
        private System.IO.Ports.SerialPort connection { get; set; }
        private static CTP_packet command;
        private byte[] CommandStruct_to_Bytes(CTP_packet command) {
            byte[] arr = new byte[Marshal.SizeOf(command)];
            IntPtr ptr = Marshal.AllocHGlobal(Marshal.SizeOf(command));
            Marshal.StructureToPtr(command, ptr, true);
            Marshal.Copy(ptr, arr, 0, Marshal.SizeOf(command));
            Marshal.FreeHGlobal(ptr);
            return arr;
        }
        private bool Check_phisically_connected()
        {
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
                    Console.WriteLine("Arduino connected!!!");
                    is_connected = true;
                    break;
                }
                connection.Close();
            }
            return is_connected;
                
        }
        public Microcontroller() {
            connection = new System.IO.Ports.SerialPort();
            connection.BaudRate = 9600;
            connection.Parity = System.IO.Ports.Parity.None;
            connection.StopBits = System.IO.Ports.StopBits.One;
            connection.DataBits = 8;
            connection.ReadTimeout = 300;
            command = new CTP_packet();
            //Check_phisically_connected();
            Console.WriteLine("Here building and connected Arduino");
            if (Check_phisically_connected() == false)
            {
                Console.WriteLine("Microcontroller device not found.");
                throw new Exception("Microcontroller device not found.");
            }
            else{
                Console.WriteLine("Arduino connection opened!!!");
            }
        }
        ~Microcontroller() 
        {
            Console.WriteLine("Close Serial Port Connection");
            connection.Close();
        }
        private byte ReadByteAfterCommand(CTP_packet _command) {
            if (connection.IsOpen == false)
                return 0;
            connection.Write(CommandStruct_to_Bytes(command), 0, Marshal.SizeOf(command) - 1);
            byte[] buffer = new byte[1];
            connection.Read(buffer, 0, 1);
            Console.WriteLine($"Recieved after command: {Convert.ToInt32(buffer[0])}");
            return buffer[0];
        }
        private Digital_Signal_Levels ReadSignalLevelOfPin(int pin_number)
        {
            command.command_type = 1;
            command.pin_number = Convert.ToByte(pin_number);
            //Console.WriteLine($"Received response in ReadSignalLevelofPin {Convert.ToInt32(response)}");
            return (Digital_Signal_Levels)(Convert.ToInt32(ReadByteAfterCommand(command)));
        }
        private int SetSignalLevel(int pin_number, int signal_level) {
            if (signal_level == (int)Digital_Signal_Levels.LOW)
            {
                command.command_type = 2;
            }
            else if (signal_level == (int)Digital_Signal_Levels.HIGH)
            {
                command.command_type = 3;
            }
            else {
                return 0;
            }
            command.pin_number = Convert.ToByte(pin_number);
            byte response = ReadByteAfterCommand(command);
            Console.WriteLine($"Received response in SetSignalLevel {Convert.ToInt32(response)}");
            if (Convert.ToInt32(response) != 200 || Convert.ToInt32(response) == 0) {
                return 0;
            }
            return 1;
        }
        private int SetPWMSignal(int pin_number, int duty, int frequency) {
            command.command_type = 4;
            command.duty = Convert.ToByte(duty);
            command.frequency = Convert.ToUInt32(frequency);
            command.pin_number = Convert.ToByte(pin_number);
            byte response = ReadByteAfterCommand(command);
            Console.WriteLine($"Received response in SetPWMSignal {Convert.ToInt32(response)}");
            if (Convert.ToInt32(response) != 200 || Convert.ToInt32(response) == 0)
            {
                return 0;
            }
            return 1;
        }
        public Pins_Status Get_GPIO_Outputs_Signal_Level()
        {
            Pins_Status response_result = new Pins_Status();


            foreach (var pin_id in Ids_Usings_Pins.Using_Digital_GPIO_Arduino_Outputs)
            {
                // Print in console recieved bytes. Signal Level on second byte.
                //Console.WriteLine($"{Convert.ToString(buffer[0], 2).PadLeft(8, '0')}");
                //Console.WriteLine($"{Convert.ToString(buffer[1], 2).PadLeft(8, '0')}");
                response_result.AddPinLevel(pin_id.Key, ReadSignalLevelOfPin(pin_id.Value));
            }
            return response_result;
        }
        public int Post_Request_To_GPIO(Pin_Setting post_settings) {
            if (post_settings.PWM_signal_status)
            {
                return SetPWMSignal(Ids_Usings_Pins.Using_Digital_GPIO_Arduino_Outputs[post_settings.button_number], post_settings.duty, post_settings.frequency);
            }
            return SetSignalLevel(Ids_Usings_Pins.Using_Digital_GPIO_Arduino_Outputs[post_settings.button_number], post_settings.signal_level);
        }
    }
}
