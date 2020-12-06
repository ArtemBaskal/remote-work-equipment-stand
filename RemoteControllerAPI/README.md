# Launching requirments
This WebAPI working on ASP.NET Core 3.1
For working API should be installed ASP.NET Core 3.1 or latest version [ASP.NET Core](https://dotnet.microsoft.com/download/dotnet-core/3.1).
Also, should be phisically connected Arduino with special sketch (see [Arduino_Sketches()]) to the server (where API running). if Arduino not connected
or correct sketch not running on the Arduino, program throw exception after launch. 

# Development requirments
To build and run this API in development mode should be additionally installed System.IO.Ports. To download and install this package you can use NuGet packages.
For example: In Visual Studio 2017 or 2019 open Tools -> NuGetPackage Manager -> Package Manager Concole and input this string:
### `Install-Package System.IO.Ports -Version 5.0.0`
![Picture_1](https://git.miem.hse.ru/358/remote-stand/-/blob/master/RemoteControllerAPI/for_readme/NuGetPackages.png)

# Running WebAPI on the server
Go to API directory (Debug/Release), where located .dll resulting file of the assembly.
In command prompt use command: ### `dotnet RemoteControllerAPI.dll --url="your url"'

# API in working
This API working with GET and POST HTTP requests
GET response contains JSON with all available microcontroller digital GPIO states (LOW/HIGH)
POST request in body should contain JSON structure. This structure discribe state of the pin: {"pin_number":2, "signal_level":1} - set the pin number 2 in HIGH level output status
POST request return HTTP status code 400 (Bad Request) if something going wrong, else return 200 OK.
Examples: 
GET request:
![Picture_2](https://git.miem.hse.ru/358/remote-stand/-/blob/master/RemoteControllerAPI/for_readme/GET_request.jpg)
![Picture_3](https://git.miem.hse.ru/358/remote-stand/-/blob/master/RemoteControllerAPI/for_readme/Get_request_result.jpg)
POST request (set pin number 7 in high state)
![Picture_3](https://git.miem.hse.ru/358/remote-stand/-/blob/master/RemoteControllerAPI/for_readme/POST_request.jpg)
![Picture_4](https://git.miem.hse.ru/358/remote-stand/-/blob/master/RemoteControllerAPI/for_readme/POST_request_result.jpg)
