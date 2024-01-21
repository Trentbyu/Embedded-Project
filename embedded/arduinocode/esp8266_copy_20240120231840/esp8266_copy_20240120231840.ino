#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char *ssid = "your-SSID";
const char *password = "your-PASSWORD";

ESP8266WebServer server(80);

void handleEndpoint() {
  server.send(200, "text/plain", "Hello from ESP8266!");
}

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Define API endpoint
  server.on("/api", HTTP_GET, handleEndpoint);

  // Start server
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}
