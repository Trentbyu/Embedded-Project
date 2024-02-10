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