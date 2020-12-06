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
            return new JsonResult(arduino.Http_Get_Gpio_Status());
        }

        // Working with HTTP POST method
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Digital_GPIO_Output digital_pin)
        {
            return arduino.Http_Post_Gpio_Signal_Level(digital_pin);
        }
    }
}
