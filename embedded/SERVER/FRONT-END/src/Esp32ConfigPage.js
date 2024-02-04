import React from 'react';
import Esp32Config from './compoents/esp32Config';
import Esp8266Config from './compoents/esp8266';
import { motion } from 'framer-motion';
import pageData from './HomePage.json'; // Import JSON directly

const Esp32ConfigPage = () => {

  // Keep track of seen IP addresses for each device type
  const seenIPs = {
    ESP32: new Set(),
    ESP8266: new Set()
  };

  return (
    <div className="min-h-screen flex flex-col py-10 bg-gray-500">
      {pageData.components.map((component, index) => {
        const { Device, ESPNAME, imageSourceLink } = component.props;
        // If the IP address has already been seen for this device type, skip rendering
        if (seenIPs[Device].has(imageSourceLink)) {
          return null;
        }
        // If not, mark the IP address as seen for this device type and render the component
        seenIPs[Device].add(imageSourceLink);
        return (
          <div key={index} className="flex flex-col sm:flex-row my-5 sm:mb-2">
            <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
              {Device === 'ESP32' && (
                <Esp32Config
                  apiEndpoint={imageSourceLink}
                  ESPNAME={ESPNAME}
                />
              )}
              {Device === 'ESP8266' && (
                <Esp8266Config
                  temperatureApiEndpoint={imageSourceLink}
                  ESPNAME={ESPNAME}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Esp32ConfigPage;
