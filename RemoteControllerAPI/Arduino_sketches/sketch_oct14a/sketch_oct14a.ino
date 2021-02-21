//void setup(){}
//
//void loop(){}
#include "GyverPWM.h"


int pin1 = 2;
int pin2 = 3;
int pin3 = 4;
int pin4 = 5;
int pin5 = 8;
int pin6 = 9;
int pin7 = 10;
int pin8 = 11;

const uint8_t bad_pin = 101;
const uint8_t bad_request = 102;
const uint8_t bad_duty = 103;
const uint8_t bad_frequency = 104;
const uint8_t unknown = 105;
const uint8_t OK = 200;

// Command Transfer Protocol Packet (CTP)
typedef struct CTP_packet{
  // 1 - Give signal level on pin in any case (PWM or Digital)
  // 2 - Set on pin low level signal (if earlier was set PWM, PWM stopped)
  // 3 - Set on pin high level signal (if earlier was set PWM, PWM stopped)
  // 4 - Set on special pins (3 - button_2 FPGA, 5 - button_4 FPGA, 9 - button_6 FPGA, 10 - button_7 FPGA, 11 - button_8 FPGA) PWM signal
  uint8_t command_type;
  // GPIO pin numbers: 2,3,4,5,8,9,10,11
  uint8_t pin_number;
  // if set command = 4, should be defined duty (0 - 255) and frequency (250 - 2000'000 Herz)
  uint8_t duty;
  uint32_t frequency;   
} CTP_Packet;

char structure_bytes[sizeof(CTP_Packet)];

void PrintLevelOnPin(int _pin);

void SetSignalLevelOutput(int _pin, int signal_level, bool debugging_info = true);

void setup() {
  // Setting bit rate
  // Setting delay 50 micro seconds
  Serial.begin(9600);
  Serial.setTimeout(10);
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
//000000010000010000000000000000000000000000000000000000000000000
void loop() {
  if(Serial.available()){
    Serial.readBytes(structure_bytes, sizeof(CTP_Packet));
    Serial.flush();
    CTP_Packet command;
    memcpy(&command, structure_bytes, sizeof(CTP_Packet));
    //Serial.print(command.pin_number);
    //Serial.write(command.command_type);
    if(command.pin_number >= 2 && command.pin_number <= 5 || command.pin_number >= 8 && command.pin_number <= 11){
      if(command.command_type == 1){
        PrintLevelOnPin(command.pin_number);
      }
      else if(command.command_type == 2){
        PWM_detach(command.pin_number);
        SetSignalLevelOutput(command.pin_number, LOW, false);
        Serial.write(OK);
      }
      else if(command.command_type == 3){
        PWM_detach(command.pin_number);
        SetSignalLevelOutput(command.pin_number, HIGH, false);
        Serial.write(OK);
      }
      else if(command.command_type == 4){
        if(command.pin_number != 3 && command.pin_number != 5 && command.pin_number != 9 && command.pin_number != 10 && command.pin_number != 11){
          Serial.write(bad_pin);
        }
        else if(command.duty < 0 && command.duty > 255){
          Serial.write(bad_duty);
        }
        else if(command.frequency < 250 && command.frequency > 200000){
          Serial.write(bad_frequency);
        }
        else{
          PWM_detach(command.pin_number);
          PWM_frequency(command.pin_number, command.frequency, 1);
          PWM_set(command.pin_number, command.duty);
          PWM_attach(command.pin_number);
          Serial.write(OK);
        }
      }
      else
        Serial.write(bad_request);
    }
    else{
      Serial.write(bad_pin);
    }
  }
  //delay(500);
}


void PrintLevelOnPin(int _pin){
  Serial.write(digitalRead(_pin));
}

// In Signal level should be LOW macro or HIGH macro
void SetSignalLevelOutput(int _pin, int signal_level,bool debugging_info = true){
  pinMode(_pin, OUTPUT);
  digitalWrite(_pin, signal_level);
  if(debugging_info){
    PrintLevelOnPin(_pin);
  }
}
