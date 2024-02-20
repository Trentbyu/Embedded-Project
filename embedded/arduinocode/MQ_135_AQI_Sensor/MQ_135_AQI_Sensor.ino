#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

// Replace with your WiFi credentials
const char* ssid = "TP-Link_49D5";
const char* password = "ECEN361$";

const int mqPin = A0;

// Create an AsyncWebServer object on port 80 to view the data. 
AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());

  // Route for root
  // server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  //   String html = "<html><body>";
  //   html += "<h1>Sensor Data</h1>";
    
  //   int mqValue = readMQ135();
  //   int aqiValue = calculateAQI(mqValue);
  //   // Displaying values on webpage
  //   html += "<p>AQI: " + String(aqiValue) + " - " + getAqiCategory(aqiValue) + "</p>";
  //   html += "<p>CO2 Level: " + String(mqValue) + " ppm</p>";
  //   html += "<p>Benzene Level: " + String(mqValue) + " ppb</p>";
    
  //   html += "</body></html>";
  //   request->send(200, "text/html", html);
  // });
  server.on("/aqi", HTTP_GET, handleaqi);

  DefaultHeaders::Instance().addHeader("access-Control-Allow-Origin", "*");
  
  // Start server
  server.begin();
}

void loop() {
 
}

int readMQ135() {
  // Reading analog value from MQ135 sensor
  int sensorValue = analogRead(mqPin);

  return sensorValue;
}
// this code takes the value for the sensor and comapres it to an AQI range.
int calculateAQI(int sensorValue) {
  // Map the sensor reading to AQI 
  int aqi;

  if (sensorValue < 250) {
    aqi = map(sensorValue, 0, 250, 0, 50); // Good
  } else if (sensorValue < 400) {
    aqi = map(sensorValue, 250, 400, 51, 100); // Moderate
  } else if (sensorValue < 600) {
    aqi = map(sensorValue, 401, 600, 101, 150); // Unhealthy for sensitive groups
  } else if (sensorValue < 800) {
    aqi = map(sensorValue, 601, 800, 151, 200); // Unhealthy
  } else if (sensorValue < 1000) {
    aqi = map(sensorValue, 801, 1000, 201, 300); // Very Unhealthy
  } else {
    aqi = map(sensorValue, 1001, 1023, 301, 500); // Hazardous
  }

  return aqi;
}

String getAqiCategory(int aqi) {
  // Return the AQI category based on the AQI value
  if (aqi <= 50) {
    return "Good";
  } else if (aqi <= 100) {
    return "Moderate";
  } else if (aqi <= 150) {
    return "Unhealthy for Sensitive Groups";
  } else if (aqi <= 200) {
    return "Unhealthy";
  } else if (aqi <= 300) {
    return "Very Unhealthy";
  } else {
    return "Hazardous";
  }
}

void handleaqi(AsyncWebServerRequest *request) {

    int mqValue = readMQ135();
  
    int aqi = calculateAQI(mqValue);
  // Create a JSON string
  String jsonString = "{";
  jsonString += "\"aqi\":\"";
  jsonString += aqi;
  jsonString += "\"}";

  // Send the JSON response
  request->send(200, "application/json", jsonString);
}
