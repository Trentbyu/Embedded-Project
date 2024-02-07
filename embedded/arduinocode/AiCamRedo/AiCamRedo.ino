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

char ssid[32]; // Maximum length for SSID
char password[64]; // Maximum length for password
char serverIP[16]; // Maximum length for server IP
bool power;
IPAddress staticIP(192, 168, 0, 100);  // Set your desired static IP address
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

void handleVideoStream(AsyncWebServerRequest *request) {
   // Capture a frame from the camera
  camera_fb_t *fb = esp_camera_fb_get();
  // Check if camera capture failed
  if (!fb) {
    request->send(500, "text/plain", "Camera capture failed");
    ESP.restart();
    return;
  }
  // Send the captured frame as a response
  request->send_P(200, "image/jpeg", fb->buf, fb->len);
  // Serial.println("img sent");
  // Return the captured frame buffer to the camera
  esp_camera_fb_return(fb);
}

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
}

void loop() {
  // delay(5000);
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= timerInterval) {
    // sendPhoto();
    previousMillis = currentMillis;
  }
  bool newState = digitalRead(buttonPin);
  // Check if the button state has changed
  if (newState != buttonState) {
    buttonState = newState;
    
    // If button is pressed (assuming the button is connected between GPIO and GND)
    if (buttonState == LOW) {
      Serial.println("Button pressed!");
      // Perform your action here when the button is pressed
     
      sendPhoto();
      delay(100);

    }

    for(int i =0; i<10; i++){
    sendPhoto();
    delay(100);
    }
  }

    

}


  //  Serial.println("flash");

  // digitalWrite(flashPin, !digitalRead(flashPin));
  // delay(500);


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
  
  // Serial.println("Connecting to server: " + serverName);

  if (client.connect(serverName.c_str(), serverPort)) {
    // Serial.println("Connection successful!");    
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
    delay(1000);
    char serverIPCharArray[16]; // Maximum length for server IP
    readServerIPFromEEPROM(serverIPCharArray);

    // Convert char array to String
    String serverIP = String(serverIPCharArray);

    // Construct server name using the retrieved server IP address
    
    serverName = serverIP;

    getBody = "Connection to " + serverName +  " failed.";
    delay(1000);
    Serial.println(getBody);
  }
  return getBody;
}
void handleRestart(AsyncWebServerRequest *request) {
  delay(1000);  // Optional delay to ensure the response is sent
  Serial.println("Restart");
  delay(1000);
   
  ESP.restart();
  
}

void handleSetInterval(AsyncWebServerRequest *request) {
  // Get the "interval" parameter from the URL
  String intervalStr = request->getParam("interval")->value();

  // Convert the interval string to an integer
  int interval = intervalStr.toInt();

  if (interval == 0 && intervalStr != "0") {
    // Handle conversion error
    request->send(400, "text/plain", "Invalid interval");
    return;
  }

  // Respond to the request
  String responseMessage = "Setting interval to: " + intervalStr + " milliseconds";
  request->send(200, "text/plain", responseMessage);

  // Set the timer interval
  timerInterval = interval;

  Serial.println("Interval set successfully");
  Serial.print("New interval: ");
  Serial.println(timerInterval);
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
void handleSleep(AsyncWebServerRequest *request) {
  // Get the "duration" parameter from the URL
  String sleepDurationStr = request->getParam("duration")->value();

  // Convert the sleep duration string to an integer

  int sleepDuration = sleepDurationStr.toInt();
  if (sleepDuration == 0 && sleepDurationStr != "0") {
    // Handle conversion error
    request->send(400, "text/plain", "Invalid sleep duration");
    return;
  }

  // Respond to the request
  String responseMessage = "Setting sleep duration to: " + sleepDurationStr + " seconds";
  request->send(200, "text/plain", responseMessage);

  // Convert seconds to microseconds for esp_sleep_enable_timer_wakeup
  esp_sleep_enable_timer_wakeup(sleepDuration * uS_TO_S_FACTOR);

  delay(500);
  Serial.println("Entering light sleep mode for " + sleepDurationStr + " seconds...");
  delay(500);

  esp_light_sleep_start();
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

void saveServerIPToEEPROM(const String& serverIP) {
    // Save server IP address to EEPROM
    int addr = sizeof(password) + sizeof(ssid); // Assuming password and ssid are declared globally
    for (int i = 0; i < serverIP.length(); ++i) {
        EEPROM.write(addr + i, serverIP[i]);
    }
    EEPROM.write(addr + serverIP.length(), '\0'); // Null-terminate the string
    EEPROM.commit();
}

void readServerIPFromEEPROM(char* serverIPCharArray) {
    int addr = sizeof(password) + sizeof(ssid); // Assuming password and ssid are declared globally
    char c = EEPROM.read(addr);
    int i = 0;
    while (c != '\0' && i < 15) { // Assuming the max length of the IP address is 15 characters
        serverIPCharArray[i++] = c;
        c = EEPROM.read(addr + i);
    }
    serverIPCharArray[i] = '\0'; // Null-terminate the string
}

void handleServerIPRequest(AsyncWebServerRequest *request) {
    Serial.println("GOT IT ");
    // Get the "ip" query parameter
    if (request->hasParam("ip")) {
        // Get the value of the "ip" parameter as a String
        String newServerIP = request->getParam("ip")->value();

        // Remove leading and trailing whitespaces
        newServerIP.trim();

        // Save the server IP address to EEPROM
        saveServerIPToEEPROM(newServerIP);

        // Respond with a success message
        String responseMessage = "Server IP address saved to EEPROM: " + newServerIP;
        request->send(200, "text/plain", responseMessage);
    } else {
        // Respond with an error message if "ip" parameter is not present
        request->send(400, "text/plain", "Missing 'ip' parameter");
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
  // Serial.println(getCpuFrequencyMhz());
  String jsonResponse = "{\"powerState\":\"" + String(stateParam) + "\"}";

  // Respond with the JSON
  request->send(200, "application/json", jsonResponse);
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