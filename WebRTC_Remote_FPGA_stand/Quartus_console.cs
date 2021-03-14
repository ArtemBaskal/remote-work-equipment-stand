using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace WebRTC_Remote_FPGA_stand
{
    public class Quartus_console
    {
        private const string environment_variable = "QUARTUS_ROOTDIR";
        public string path_to_quartus { get; }

        private static Process cmd;

        private static Quartus_console _instance;

        private Quartus_console() {
            cmd = new Process();
            cmd.StartInfo.FileName = "cmd.exe";
            cmd.StartInfo.RedirectStandardInput = true;
            cmd.StartInfo.RedirectStandardOutput = true;
            cmd.StartInfo.CreateNoWindow = true;
            cmd.StartInfo.UseShellExecute = false;


            cmd.Start();
            cmd.StandardInput.WriteLine("SET " + environment_variable);
            cmd.StandardInput.Flush();
            cmd.StandardInput.Close();
            cmd.WaitForExit();

            cmd.StandardOutput.ReadLine();
            cmd.StandardOutput.ReadLine();
            cmd.StandardOutput.ReadLine();
            cmd.StandardOutput.ReadLine();
            //Console.WriteLine(cmd.StandardOutput.ReadToEnd());

            string path = cmd.StandardOutput.ReadLine();
            path_to_quartus = path.Substring(path.IndexOf('=') + 1) + "\\bin64\\";

        }

        static public Quartus_console GetInstance() {
            if(_instance == null)
            {
                _instance = new Quartus_console();
            }
            return _instance;
        }

        public Task<string> RunQuartusCommandAsync(string command) {
            // Restart StandardInput
            cmd.Start();

            cmd.StandardInput.WriteLine(path_to_quartus + command);
            cmd.StandardInput.Flush();
            cmd.StandardInput.Close();
            //cmd.WaitForExit();
            return cmd.StandardOutput.ReadToEndAsync();
        }

        public string RunQuartusCommand(string command)
        {
            // Restart StandardInput
            cmd.Start();

            cmd.StandardInput.WriteLine(path_to_quartus + command);
            cmd.StandardInput.Flush();
            cmd.StandardInput.Close();
            cmd.WaitForExit();
            return cmd.StandardOutput.ReadToEnd();
        }
    }
}
