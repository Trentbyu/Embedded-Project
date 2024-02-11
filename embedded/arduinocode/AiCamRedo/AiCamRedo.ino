#include <Arduino.h>
#include <WiFi.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "esp_camera.h"
#include "ESPAsyncWebServer.h"
#include <AsyncTCP.h>
#include <EEPROM.h>
#include <esp_pm.h>
#include <esp_sleep.h>
#include <HTTPClient.h>


TaskHandle_t buttonTaskHandle = NULL;

char ssid[32]; // Maximum length for SSID
char password[64]; // Maximum length for password
char serverIP[16]; // Maximum length for server IP
bool power;
IPAddress staticIP(192, 168, 0, 116);  // Set your desired static IP address
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);
bool wifiConnected = 0;
#define uS_TO_S_FACTOR 1000000
#ifdef __cplusplus
extern "C" {
#endif

  uint8_t temprature_sens_read();

#ifdef __cplusplus
}
#endif

String serverName = "";   // REPLACE WITH YOUR Raspberry Pi IP ADDRESS
// String serverIP = "";   // REPLACE WITH YOUR Raspberry Pi IP ADDRESS

//String serverName = "example.com";   // OR REPLACE WITH YOUR DOMAIN NAME

String serverPath = "/api/save_image";     // The default serverPath should be upload.php

const int serverPort = 5000;
const int buttonPin = 2; // Change this to the GPIO pin you're using for the button
bool buttonState = false;
const int flashPin = 4;
WiFiClient client;


// CAMERA_MODEL_AI_THINKER
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27

#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22
AsyncWebServer server(80);
const int DEFAULT_INTERVAL = 10000; // Default interval value
int timerInterval = DEFAULT_INTERVAL;
unsigned long previousMillis = 0;   // last time image was sent



void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); 
  power = true;
  Serial.begin(115200);
  pinMode(buttonPin, INPUT_PULLUP); // Set buttonPin as input with internal pull-up resistor
  pinMode(flashPin, OUTPUT);
  Serial.println("Hello...");
  // Connect to Wi-Fi
  EEPROM.begin(512); // Initialize EEPROM with 512 bytes

  // Load WiFi credentials from EEPROM
  EEPROM.get(0, ssid);
  EEPROM.get(sizeof(ssid), password);
  char serverIPCharArray[16]; // Maximum length for server IP
  readServerIPFromEEPROM(serverIPCharArray);

  // Convert char array to String
  String serverIP = String(serverIPCharArray);

  // Construct server name using the retrieved server IP address
  
  serverName = serverIP;


  WiFi.mode(WIFI_STA);

  connectToWiFi();
  Serial.print("CPU Freq: ");
  Serial.println(getCpuFrequencyMhz());
  Serial.println(WiFi.localIP());

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  // init with high specs to pre-allocate larger buffers
  if(psramFound()){
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 10;  //0-63 lower number means higher quality
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_CIF;
    config.jpeg_quality = 12;  //0-63 lower number means higher quality
    config.fb_count = 1;
  }
  
  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    delay(1000);
    ESP.restart();
  }
   
  // setCpuFrequencyMhz(80);


  delay(1000);  // Add a delay of 5 seconds

  Serial.println(WiFi.status());
  // Serve the video stream
  server.on("/restart", HTTP_GET, handleRestart);
  server.on("/temperature", HTTP_GET, handleTemperature);
  server.on("/power", HTTP_GET, handlePowerRequest);
  server.on("/sleep", HTTP_GET, handleSleep);
  server.on("/serverIP", HTTP_GET, handleServerIPRequest);
  server.on("/set_interval", HTTP_GET, handleSetInterval);
  server.on("/video", HTTP_GET, handleVideoStream);
  
 
  DefaultHeaders::Instance().addHeader("access-Control-Allow-Origin", "*");

  server.begin();

 
  Serial.println("READY");
  


  sendPhoto(); 

  xTaskCreatePinnedToCore(
    periodicTask,       // Task function
    "PeriodicTask",     // Task name
    4096,               // Stack size (words, not bytes)
    NULL,               // Task parameters
    1,                  // Priority (1 is default)
    NULL,                // Task handle
    1
  );

   xTaskCreatePinnedToCore(buttonTask, "Button Task", 4096, NULL, 1, &buttonTaskHandle, 1);
}

void loop() {


}



