void callEndpoint(String endpoint) {
  HTTPClient http;
  
  // Construct the complete URL with the endpoint
  String url = "http://192.168.0.200" + endpoint;

  Serial.print("Calling endpoint: ");
  Serial.println(url);

  // Make a GET request to the endpoint
  http.begin(url);

  // Get the HTTP response
  int httpResponseCode = http.GET();
  if (httpResponseCode > 0) {
   
    Serial.println(httpResponseCode);

  } else {
    Serial.print("Error in HTTP request: ");
    Serial.println(httpResponseCode);
  }

  // Close the connection
  http.end();
}

void buttonTask(void *parameter) {
  TickType_t lastFloatSendTime = 0;
  while (true) {
    bool newState = digitalRead(buttonPin);
    
    // Check if the button state has changed
    if (newState != buttonState) {
      buttonState = newState;
      
      // If button is pressed (assuming the button is connected between GPIO and GND)
      if (buttonState == LOW) {
        Serial.println("Button pressed!");
        TickType_t startTime = xTaskGetTickCount(); // Record the start time
        
        // Run the block for 5 seconds
        while ((xTaskGetTickCount() - startTime) <= pdMS_TO_TICKS(5000)) {
          if ((xTaskGetTickCount() - lastFloatSendTime) >= pdMS_TO_TICKS(1000)) {
            // Update the last float send time
            lastFloatSendTime = xTaskGetTickCount();
            // Send the float value
            sendPhoto();
          }
        }
      }
    }
    vTaskDelay(10 / portTICK_PERIOD_MS); // Delay for 10 milliseconds before checking button state again
  }
}