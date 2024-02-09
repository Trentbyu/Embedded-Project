
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
    String serverIP = "192.168.1.111";

    // Construct server name using the retrieved server IP address
    
    serverName = serverIP;

    getBody = "Connection to " + serverName +  " failed.";
    delay(1000);
    Serial.println(getBody);
  }
  return getBody;
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
