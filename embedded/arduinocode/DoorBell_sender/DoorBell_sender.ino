// 54:43:B2:AB:37:48
#include <esp_now.h>
#include <WiFi.h>

// Replace these with the MAC address of your receiver ESP32
uint8_t receiverMacAddress[] = {0xD4, 0x8A, 0xFC, 0xCF, 0x2C, 0xF8};

void setup() {
  Serial.begin(115200);
  
  // Initialize ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register peer
  esp_now_peer_info_t peerInfo;
  memcpy(peerInfo.peer_addr, receiverMacAddress, 6);
  peerInfo.channel = 0; // Set channel (optional)
  peerInfo.encrypt = false; // No encryption

  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }
}

void loop() {
  // Data to send
  String dataToSend = "Hello from sender!";
  
  // Send data
  esp_err_t result = esp_now_send(receiverMacAddress, (uint8_t *)dataToSend.c_str(), dataToSend.length());
  
  if (result == ESP_OK) {
    Serial.println("Data sent successfully");
  } else {
    Serial.println("Error sending data");
  }

  delay(1000); // Delay before sending the next message
}
