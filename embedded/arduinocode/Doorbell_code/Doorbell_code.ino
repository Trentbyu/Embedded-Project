// D4:8A:FC:CF:2C:F8
#include <esp_now.h>
#include <WiFi.h>

#define TOGGLE_PIN 2

// MAC address of the sender ESP32
uint8_t senderMacAddress[] = {0x54, 0x43, 0xB2, 0xAB, 0x37, 0x48};

// Callback function to handle received data
void onDataReceived(const uint8_t *mac, const uint8_t *data, int len) {
  Serial.print("Received data: ");
  for (int i = 0; i < len; i++) {
    Serial.print((char)data[i]);
  }
  Serial.println();
  
  // Toggle pin 2
  digitalWrite(TOGGLE_PIN, !digitalRead(TOGGLE_PIN));
}

void setup() {
  Serial.begin(115200);

  // Initialize ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register callback function for receiving data
  esp_now_register_recv_cb(onDataReceived);
  
  // Set pin mode for toggling pin
  pinMode(TOGGLE_PIN, OUTPUT);
}

void loop() {
  // Do other tasks here if needed
  delay(1000);
}
