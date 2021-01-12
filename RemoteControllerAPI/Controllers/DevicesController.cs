using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RemoteStandAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO.Ports;
using System.Threading;
using System.Net;
using System.Net.Http;
using System.Text.Json;

namespace RemoteStandAPI.Controllers
{
    

    [ApiController]
    [Route("[controller]")]
    public class MicrocontrollerController : ControllerBase
    {
        static Microcontroller arduino = new Microcontroller();

        private readonly ILogger<MicrocontrollerController> _logger;

        public MicrocontrollerController(ILogger<MicrocontrollerController> logger)
        {
            _logger = logger;
        }


        // Здесь может вернуться и string
        // Working with HTTP GET method
        [HttpGet]
        public JsonResult Get()
        {
            return new JsonResult(arduino.Get_GPIO_Outputs_Signal_Level());
        }

        // Working with HTTP POST method
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Pin_Setting post_settings)
        {
            // Bad input json
            if (Ids_Usings_Pins.Using_Digital_GPIO_Arduino_Outputs.ContainsKey(post_settings.button_number) == false)
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            Console.WriteLine($"Recieved json: {JsonSerializer.Serialize(post_settings)}");
            if (arduino.Post_Request_To_GPIO(post_settings) == 0) {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
