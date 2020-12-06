using System;
using System.IO.Ports;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Collections.Generic;
using System.Net.Http;

namespace RemoteStandAPI
{
    public class Ids_Usings_Pins {
        // input GPIO_0[0] on FPGA = LEDDR[0] - output pin number Arduino 11
        // input GPIO_0[2] on FPGA = LEDDR[1] - output pin number Arduino 10
        // input GPIO_0[4] on FPGA = LEDDR[2] - output pin number Arduino 9
        // input GPIO_0[6] on FPGA = LEDDR[3] - output pin number Arduino 8
        // input GPIO_0[10] on FPGA = LEDDR[4] - output pin number Arduino 5 
        // input GPIO_0[12] on FPGA = LEDDR[5] - output pin number Arduino 4
        // input GPIO_0[14] on FPGA = LEDDR[6] - output pin number Arduino 3
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
    public class Microcontroller
    {
        private System.IO.Ports.SerialPort connection { get; set; }
        private bool Check_phisically_connected()
        {
            int number_of_ports_to_check = 6;
            bool is_connected = false;
            // Expected response - Unxepected pin
            const string test_message = "Hello -10";
            char[] buffer = new char[15];
            string expected_response = "Unexpected_pin\r";
            for (int port_number = number_of_ports_to_check; port_number > 0; port_number--) {
                connection.PortName = "COM" + port_number.ToString();
                try
                {
                    connection.Open();
                    connection.Write(test_message);
                    for (int i = 0; i < 15; i++) {
                        connection.Read(buffer, i, 1);
                    }

                }
                catch (Exception) {

                    connection.Close();
                    continue;
                }

                string response = new string(buffer);
                Console.WriteLine($"Got response {response}");
                Console.WriteLine($"Comparison result: {string.Compare(response, expected_response)}");
                if (string.Compare(response, expected_response) == 0)
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
        private Digital_Signal_Levels ReadSignalLevelOfPin() 
        {
            char[] buffer = new char[3];
            for (int i = 0; i < 3; i++)
            {
                try
                {
                    connection.Read(buffer, i, 1);
                }
                catch (Exception)
                {
                    buffer[i] = '9';
                }
            }
            return (Digital_Signal_Levels)(buffer[1] - '0');
        }
        private Pins_Status Get_GPIO_Outputs_Signal_Level()
        {
            Pins_Status response_result = new Pins_Status();
            //connection.ReadTimeout = 300;
            const string command = "GetSignalLevel ";
            char[] buffer = new char[3];
            foreach (var pin_id in Ids_Usings_Pins.Using_Digital_GPIO_Arduino_Outputs)
            {
                //Console.WriteLine($"On arduino pin: {pin_id.Value}");
                //if (connection.IsOpen == false)
                //    Console.WriteLine("Connection already closed:(");
                connection.Write(command + pin_id.Value.ToString());

                // Print in console recieved bytes. Signal Level on second byte.
                //Console.WriteLine($"{Convert.ToString(buffer[0], 2).PadLeft(8, '0')}");
                //Console.WriteLine($"{Convert.ToString(buffer[1], 2).PadLeft(8, '0')}");
                //Console.WriteLine($"{buffer[0] - '0'}");
                //Console.WriteLine($"{buffer[1] - '0'}");
                //Console.WriteLine($"{buffer[1] - '0'}");
                response_result.AddPinLevel(pin_id.Key, ReadSignalLevelOfPin());
            }
            return response_result;
        }
        public Pins_Status Http_Get_Gpio_Status() {
            return Get_GPIO_Outputs_Signal_Level();
            
        }
        public HttpResponseMessage Http_Post_Gpio_Signal_Level(Digital_GPIO_Output _gpio_button) {
            if (Ids_Usings_Pins.Using_Digital_GPIO_Arduino_Outputs.ContainsKey(_gpio_button.pin_number) == false) 
            {
                return new HttpResponseMessage(System.Net.HttpStatusCode.BadRequest);
            }
            int pin_value = Ids_Usings_Pins.Using_Digital_GPIO_Arduino_Outputs[_gpio_button.pin_number];
            string command;
            if (_gpio_button.signal_level == Digital_Signal_Levels.LOW)
            {
                command = "SetLowLevelOutput " + pin_value.ToString();
            }
            else if (_gpio_button.signal_level == Digital_Signal_Levels.HIGH)
            {
                command = "SetHighLevelOutput " + pin_value.ToString(); 
            }
            else {
                return new HttpResponseMessage(System.Net.HttpStatusCode.BadRequest);
            }
            connection.Write(command);
            if (ReadSignalLevelOfPin() != _gpio_button.signal_level) {
                return new HttpResponseMessage(System.Net.HttpStatusCode.BadRequest);
            }
            return new HttpResponseMessage(System.Net.HttpStatusCode.OK);
        }
    }
}
