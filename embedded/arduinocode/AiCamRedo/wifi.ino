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
  if (!wifiConnected) {
    ESP.restart();
    }
}