#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
// #include <esp_sleep.h>
// const char *ssid = "Blackfamily";
// const char *password = "Blacks1987";

#define uS_TO_S_FACTOR 1000000
char ssid[32]; // Maximum length for SSID
char password[64]; // Maximum length for password

IPAddress staticIP(192, 168, 0, 99);  // Set your desired static IP address
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);
ESP8266WebServer server(80);

bool wifiConnected = 0;
void handleEndpoint() {
  server.send(200, "text/plain", "Hello from ESP8266!");
}
void handleRestart(AsyncWebServerRequest *request) {
  delay(1000);  // Optional delay to ensure the response is sent
  Serial.println("Restarting...");
  delay(1000);
  
  ESP.restart();
}

void handleTemperature(AsyncWebServerRequest *request) {
  // Convert raw temperature in F to Celsius degrees
  float temperatureC = (temprature_sens_read() - 32) / 1.8;

  // Send the temperature response as text
  String temperatureResponse = "Temperature: " + String(temperatureC) + " C";
  request->send(200, "text/plain", temperatureResponse);
}

void setup() {
  Serial.begin(115200);

  EEPROM.begin(512); 

  
  EEPROM.get(0, ssid);
  EEPROM.get(sizeof(ssid), password);
  connectToWiFi();
  Serial.println(WiFi.localIP());

  delay(1000);  

  server.on("/api", HTTP_GET, handleEndpoint);
  server.on("/restart", HTTP_GET, handleEndpoint);
  server.on("/tempurat", HTTP_GET, handleEndpoint);



  // Start server
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
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
void handlePowerRequest(AsyncWebServerRequest *request) {
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
   ESP.lightSleep(sleepDuration * uS_TO_S_FACTOR );

  delay(500);
  Serial.println("Entering light sleep mode for " + sleepDurationStr + " seconds...");
  delay(500);

  esp_light_sleep_start();
}
