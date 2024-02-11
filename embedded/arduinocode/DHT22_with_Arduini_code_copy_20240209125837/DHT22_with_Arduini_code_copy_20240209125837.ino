// Import required libraries
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Hash.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

// Replace with your network credentials
const char* ssid = "HP Deskjet 4000";
const char* password = "Posegate";

#define DHTPIN 5     // Digital pin connected to the DHT sensor

// using sensor DHT 22
#define DHTTYPE    DHT22     // DHT 22 (AM2302)


DHT dht(DHTPIN, DHTTYPE);

// current temperature & humidity, updated in loop()
float t = 0.0;
float h = 0.0;

unsigned long previousMillis = 0;    // will store last time DHT was updated

// Updates DHT readings every 10 seconds
const long interval = 1000;  


// Replaces placeholder with DHT values
String processor(const String& var){
  //Serial.println(var);
  if(var == "TEMPERATURE"){
  
    return String(t);
  }
  else if(var == "HUMIDITY"){
    return String(h);
  }
  return String();
}

void setup(){
  // Serial port for debugging purposes
  Serial.begin(115200);
  dht.begin();
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println(".");
  }

  // Print ESP8266 Local IP Address
  Serial.println(WiFi.localIP());

  // // Route for root / web page
  // server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  //   request->send_P(200, "text/html", index_html, processor);
  // });
  // server.on("/temperature", HTTP_GET, [](AsyncWebServerRequest *request){
  //   request->send_P(200, "text/plain", String(t).c_str());
  // });
  // server.on("/humidity", HTTP_GET, [](AsyncWebServerRequest *request){
  //   request->send_P(200, "text/plain", String(h).c_str());
  // });
  server.on("/temperature", HTTP_GET, handleTemperature);

  DefaultHeaders::Instance().addHeader("access-Control-Allow-Origin", "*");

  // Start server
  server.begin();
}
 
void loop(){  
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    // save the last time you updated the DHT values
    previousMillis = currentMillis;
    // Read temperature as Celsius (the default)
    //float newT = dht.readTemperature();
     //Read temperature as Fahrenheit (isFahrenheit = true)
    float newT = dht.readTemperature(true);
    // if temperature read failed, don't change t value
    if (isnan(newT)) {
      Serial.println("Failed to read from DHT sensor!");
    }
    else {
      t = newT;
      Serial.println(t);
    }
    // Read Humidity
    // float newH = dht.readHumidity();
    // // if humidity read failed, don't change h value 
    // if (isnan(newH)) {
    //   Serial.println("Failed to read from DHT sensor!");
    // }
    // else {
    //   h = newH;
    //   Serial.println(h);
    // }
  }
}

void handleTemperature(AsyncWebServerRequest *request) {
  // Convert raw temperature in F to Celsius degrees
  // float temperatureC = (t- 32) / 1.8;

  // Create a JSON string
  String jsonString = "{";
  jsonString += "\"temperature\":";
  jsonString += t;
  jsonString += "}";

  // Send the JSON response
  request->send(200, "application/json", jsonString);
}
