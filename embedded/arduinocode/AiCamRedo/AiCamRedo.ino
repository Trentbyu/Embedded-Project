#include <Arduino.h>
// #include "ESPAsyncWebServer.h"
// #include <AsyncTCP.h>
#include "esp_camera.h"
#include <WiFi.h> 
#include <EEPROM.h>
// #include <esp_pm.h>
// #include <esp_sleep.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#ifdef __cplusplus
extern "C" {
#endif

  uint8_t temprature_sens_read();

#ifdef __cplusplus
}
#endif

#define uS_TO_S_FACTOR 1000000

const char* flaskServerAddress = "http://192.168.0.156:5000/api/save_image";
uint8_t temprature_sens_read();

char ssid[32]; // Maximum length for SSID
char password[64]; // Maximum length for password
bool power;
IPAddress staticIP(192, 168, 0, 100);  // Set your desired static IP address
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);
bool wifiConnected = 0;

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
HTTPClient http;
// AsyncWebServer server(80);
camera_config_t config; // Declare config as a global variable


bool initCamera(){
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
  config.frame_size = FRAMESIZE_SVGA;
  config.jpeg_quality = 12;
  config.fb_count = 1;
    
  esp_err_t result = esp_camera_init(&config);
   
  if (result != ESP_OK) {
    return false;
  }
 
  return true;
}


void setup() {
  power = true;
  Serial.begin(115200);
  Serial.println("Hello...");
  // Connect to Wi-Fi
  EEPROM.begin(512); // Initialize EEPROM with 512 bytes

  // Load WiFi credentials from EEPROM
  EEPROM.get(0, ssid);
  EEPROM.get(sizeof(ssid), password);


  connectToWiFi();
  Serial.print("CPU Freq: ");
  Serial.println(getCpuFrequencyMhz());
  
  // setCpuFrequencyMhz(80);
 


  delay(1000);  // Add a delay of 5 seconds
  // Serial.println("Connected to WiFi");
  // Serial.println(WiFi.status());
  Serial.println(WiFi.localIP());
  // Initialize the camera
  if (!initCamera()) {
    Serial.println("Error initializing the camera");
    return;
  }
  Serial.println(WiFi.status());
  http.begin(flaskServerAddress);
}



void loop() {
  // Camera capture and processing logic
    camera_fb_t *fb = esp_camera_fb_get();
    // Check if camera capture failed
    if (!fb) {
      Serial.println("Camera capture failed");
      delay(1000);

    }else{
      // Send the captured frame to Flask server
    sendFrameToFlask(fb->buf, fb->len);
    
    // Return the captured frame buffer to the camera
    esp_camera_fb_return(fb);

    // Adjust delay as needed to control the frame capture rate
    delay(1000); 

    }

    

  // Serial.println(WiFi.status());

  if (WiFi.status() != WL_CONNECTED) {
    ESP.restart();
  }

}
void sendFrameToFlask(uint8_t* data, size_t len) {

 // Set headers for each request
  http.addHeader("Content-Type", "image/jpeg");

  // Send POST request with image data
  int httpResponseCode = http.POST(data, len);

  if (httpResponseCode > 0) {
    String response = http.getString();
    // Handle response if needed
  } else {
    Serial.print("Error in sending HTTP POST request: ");
    Serial.println(httpResponseCode);
  }

}
void connectToWiFi() {
  WiFi.begin(ssid, password);
  WiFi.config(staticIP, gateway, subnet);

  unsigned long startTime = millis();
  while (millis() - startTime < 10000) {
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("Connected to WiFi");
      wifiConnected = true;
      break;
    }
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  if (!wifiConnected) {
    Serial.println("WiFi connection failed. Enter new SSID and password via UART.");

    Serial.print("Enter new SSID: ");
    while (!Serial.available()) {
      // Wait for user input
    }
    String newSSID = Serial.readStringUntil('\n');
    newSSID.toCharArray(ssid, sizeof(ssid));

    Serial.print("Enter new password: ");
    while (!Serial.available()) {
      // Wait for user input
    }
    String newPassword = Serial.readStringUntil('\n');
    newPassword.toCharArray(password, sizeof(password));

    // Save new credentials to EEPROM
    EEPROM.put(0, ssid);
    EEPROM.put(sizeof(ssid), password);
    EEPROM.commit();

    Serial.println("SSID and password updated successfully.");
    Serial.println("Attempting to connect to WiFi with new credentials.");

    // Connect to WiFi with new credentials
    WiFi.begin(ssid, password);
    startTime = millis();

    while (millis() - startTime < 15000) {
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("Connected to WiFi with new credentials.");
        wifiConnected = true;
        break;
      }
      delay(1000);
      Serial.println("Connecting to WiFi...");
    }

    Serial.flush();
  }
}



