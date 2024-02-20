import React, { useState, useEffect } from 'react';
import Esp32Config from './compoents/esp32Config';
import Esp8266Config from './compoents/esp8266';
import ipAddress from './index';

const Esp32ConfigPage = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    fetch(`http://${ipAddress}:5000/api/components`)
      .then(response => response.json())
      .then(data => setComponents(data))
      .catch(error => console.error('Error fetching components:', error));
  }, []);

  // Group components by IP address
  const componentsByIP = {};
  components.forEach(component => {
    const ipAddress = component.props.imageSourceLink.trim(); // Trim any leading or trailing spaces
    if (!componentsByIP[ipAddress]) {
      componentsByIP[ipAddress] = component;
    }
  });

  return (
    <div className="min-h-screen flex flex-col py-10 bg-gray-500">
      <div className="flex flex-wrap justify-center">
        {Object.keys(componentsByIP).map((ipAddress, index) => {
          const component = componentsByIP[ipAddress];
          const { Device, ESPNAME } = component.props;
          return (
            <div key={index} className="w-full sm:w-1/3 px-2 mb-4">
              <div className="h-300 mx-auto p-4">
                {Device === 'ESP32' && (
                  <Esp32Config
                    apiEndpoint={ipAddress}
                    ESPNAME={ESPNAME}
                  />
                )}
                {Device === 'ESP8266' && (
                  <Esp8266Config
                    temperatureApiEndpoint={ipAddress}
                    ESPNAME={ESPNAME}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Esp32ConfigPage;
