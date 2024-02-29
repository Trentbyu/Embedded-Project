void handleRestart(AsyncWebServerRequest *request) {
  delay(1000);  // Optional delay to ensure the response is sent
  Serial.println("Restart");
  delay(1000);
   
  ESP.restart();
  
}
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
  float temperatureC = temprature_sens_read() ;

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