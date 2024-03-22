#include <ESP8266WiFi.h>
// #include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

int ledPin = 2; // Change to your LED pin
const char *ssid = "TP-Link_49D5";
const char *password = "ECEN361$";
IPAddress staticIP(192, 100, 1, 200); // Define your desired static IP address
IPAddress gateway(192, 100, 1, 1);     // Gateway should be on the same subnet
IPAddress subnet(255, 255, 255, 0);

AsyncWebServer server(80);
void handleon(AsyncWebServerRequest *request) {
  // Convert raw temperature in F to Celsius degrees
  digitalWrite(ledPin, HIGH);


    // Create a JSON string
    String jsonString = "on";
  Serial.println("on");

  // Send the JSON response
  request->send(200, "application/json", jsonString);
}
void handleoff(AsyncWebServerRequest *request) {
  // Convert raw temperature in F to Celsius degrees

  digitalWrite(ledPin, LOW);

    // Create a JSON string
  String jsonString = "off";
  Serial.println("off");

  // Send the JSON response
  request->send(200, "application/json", jsonString);
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
  WiFi.begin(ssid, password);
  WiFi.config(staticIP, gateway, subnet); // Set static IP configuration
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/on", HTTP_GET, handleon);
  server.on("/off", HTTP_GET, handleoff);

  DefaultHeaders::Instance().addHeader("access-Control-Allow-Origin", "*");
  server.begin();
}

void loop() {
  // Nothing to be done in the loop for this example
}
