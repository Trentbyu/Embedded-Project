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
  while (true) {
    bool newState = digitalRead(buttonPin);
    
    // Check if the button state has changed
    if (newState != buttonState) {
      buttonState = newState;
      
      // If button is pressed (assuming the button is connected between GPIO and GND)
      if (buttonState == LOW) {
        Serial.println("Button pressed!");
        // Perform your action here when the button is pressed
        sendPhoto();
        vTaskDelay(100 / portTICK_PERIOD_MS); // Delay for 100 milliseconds
      }

      for (int i = 0; i < 10; i++) {
        sendPhoto();
        vTaskDelay(100 / portTICK_PERIOD_MS); // Delay for 100 milliseconds
      }
    }
    vTaskDelay(10 / portTICK_PERIOD_MS); // Delay for 10 milliseconds before checking button state again
  }
}