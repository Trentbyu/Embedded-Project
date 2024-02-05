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

const char* ssid = "Blackfamily";
const char* password = "Blacks1987";

#ifdef __cplusplus
extern "C" {
#endif

  uint8_t temprature_sens_read();

#ifdef __cplusplus
}
#endif

String serverName = "192.168.0.156";   // REPLACE WITH YOUR Raspberry Pi IP ADDRESS
//String serverName = "example.com";   // OR REPLACE WITH YOUR DOMAIN NAME

String serverPath = "/api/save_image";     // The default serverPath should be upload.php

const int serverPort = 5000;

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
const int timerInterval = 40;    // time between each HTTP POST image
unsigned long previousMillis = 0;   // last time image was sent

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); 
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("ESP32-CAM IP Address: ");
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
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;  //0-63 lower number means higher quality
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
  server.on("/restart", HTTP_GET, handleRestart);
  server.on("/temperature", HTTP_GET, handleTemperature);
  server.on("/power", HTTP_GET, handlePowerRequest);
  server.on("/sleep", HTTP_GET, handleSleep);

 
  DefaultHeaders::Instance().addHeader("access-Control-Allow-Origin", "*");

  server.begin();
  sendPhoto(); 
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= timerInterval) {
    sendPhoto();
    previousMillis = currentMillis;
  }
}
void handleRestart(AsyncWebServerRequest *request) {
  delay(1000);  // Optional delay to ensure the response is sent
  Serial.println("Restart");
  delay(1000);
   
  ESP.restart();
  
}
void handleTemperature(AsyncWebServerRequest *request) {
  // Convert raw temperature in F to Celsius degrees
  float temperatureC = (temprature_sens_read() - 32) / 1.8;

  // Create a JSON string
  String jsonString = "{";
  jsonString += "\"temperature\":";
  jsonString += temperatureC;
  jsonString += "}";

  // Send the JSON response
  request->send(200, "application/json", jsonString);
}
String sendPhoto() {
  String getAll;
  String getBody;

  camera_fb_t * fb = NULL;
  fb = esp_camera_fb_get();
  if(!fb) {
    Serial.println("Camera capture failed");
    delay(1000);
    ESP.restart();
  }
  
  Serial.println("Connecting to server: " + serverName);

  if (client.connect(serverName.c_str(), serverPort)) {
    Serial.println("Connection successful!");    
    String head = "--RandomNerdTutorials\r\nContent-Disposition: form-data; name=\"imageFile\"; filename=\"esp32-cam.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";
    String tail = "\r\n--RandomNerdTutorials--\r\n";

    uint32_t imageLen = fb->len;
    uint32_t extraLen = head.length() + tail.length();
    uint32_t totalLen = imageLen + extraLen;
  
    client.println("POST " + serverPath + " HTTP/1.1");
    client.println("Host: " + serverName);
    client.println("Content-Length: " + String(totalLen));
    client.println("Content-Type: multipart/form-data; boundary=RandomNerdTutorials");
    client.println();
    client.print(head);
  
    // Write image data to the request
    client.write(fb->buf, imageLen);
    
    client.print(tail);
    
    esp_camera_fb_return(fb);
    
    int timoutTimer = 1000;
    long startTimer = millis();
    boolean state = false;
    
    while ((startTimer + timoutTimer) > millis()) {
      Serial.print(".");
      delay(100);      
      while (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (getAll.length()==0) { state=true; }
          getAll = "";
        }
        else if (c != '\r') { getAll += String(c); }
        if (state==true) { getBody += String(c); }
        startTimer = millis();
      }
      if (getBody.length()>0) { break; }
    }
    Serial.println();
    client.stop();
    Serial.println(getBody);
  }
  else {
    getBody = "Connection to " + serverName +  " failed.";
    Serial.println(getBody);
  }
  return getBody;
}
void setPowerState(int state) {
  switch (state) {
    case 240:
        setCpuFrequencyMhz(240);
        break;
    case 160:
        setCpuFrequencyMhz(160);
        break;
    case 80:
        setCpuFrequencyMhz(80);
        break;
    // Add more cases if needed
    default:
        // Handle default case if necessary
        break;
}

}
void handlePowerRequest(AsyncWebServerRequest *request) {
  // Get the "state" query parameter
  int stateParam;

  if (request->hasParam("state")) {
    stateParam = request->getParam("state")->value().toInt();
    // Change power state based on the received parameter
    setPowerState(stateParam);
  } else {
    // If "state" parameter is not present, get the current power state
    stateParam = getCpuFrequencyMhz();
  }

  // Respond with the new or current power state
  String response = "Power state: " + String(stateParam);
    Serial.print("CPU Freq: ");
  Serial.println(getCpuFrequencyMhz());
  String jsonResponse = "{\"powerState\":\"" + String(stateParam) + "\"}";

  // Respond with the JSON
  request->send(200, "application/json", jsonResponse);
}