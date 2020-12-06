//void setup(){}
//
//void loop(){}
int pin1 = 2;
int pin2 = 3;
int pin3 = 4;
int pin4 = 5;
int pin5 = 8;
int pin6 = 9;
int pin7 = 10;
int pin8 = 11;

int pin_number = -10;
String command = "";

void PrintLevelOnPin(int _pin);

void SetSignalLevelOutput(int _pin, int signal_level, bool debugging_info = true);

void setup() {
  // Setting bit rate
  Serial.begin(9600);
  // Setting delay 50 micro seconds
  Serial.setTimeout(20);
  // Sending initial message
  // Serial.println("Initializing...");
  SetSignalLevelOutput(pin1, LOW, false);
  SetSignalLevelOutput(pin2, LOW, false);
  SetSignalLevelOutput(pin3, LOW, false);
  SetSignalLevelOutput(pin4, LOW, false);
  SetSignalLevelOutput(pin5, LOW, false);
  SetSignalLevelOutput(pin6, LOW, false);
  SetSignalLevelOutput(pin7, LOW, false);
  SetSignalLevelOutput(pin8, LOW, false);


//  SetSignalLevelOutput(pin1, HIGH, false);
//  SetSignalLevelOutput(pin2, HIGH, false);
//  SetSignalLevelOutput(pin3, HIGH, false);
//  SetSignalLevelOutput(pin4, HIGH, false);
//  SetSignalLevelOutput(pin5, HIGH, false);
//  SetSignalLevelOutput(pin6, HIGH, false);
//  SetSignalLevelOutput(pin7, HIGH, false);
//  SetSignalLevelOutput(pin8, HIGH, false);
}


void loop() {
  if(Serial.available()){
    command = Serial.readStringUntil(' ');
    pin_number = Serial.parseInt(); 
    if(pin_number >= 2 && pin_number <= 5 || pin_number >= 8 && pin_number <= 11){
      if(command == "GetSignalLevel")
        PrintLevelOnPin(pin_number);
      else if(command == "SetLowLevelOutput")
        SetSignalLevelOutput(pin_number, LOW);
      else if(command == "SetHighLevelOutput")
        SetSignalLevelOutput(pin_number, HIGH);
      else
        Serial.println("Unknown_command");
    }
    else{
      Serial.println("Unexpected_pin");
    }
  }
}


void PrintLevelOnPin(int _pin){
  Serial.println(digitalRead(_pin));
}

// In Signal level should be LOW macro or HIGH macro
void SetSignalLevelOutput(int _pin, int signal_level,bool debugging_info = true){
  pinMode(_pin, OUTPUT);
  digitalWrite(_pin, signal_level);
  if(debugging_info){
    PrintLevelOnPin(_pin);
  }
}

