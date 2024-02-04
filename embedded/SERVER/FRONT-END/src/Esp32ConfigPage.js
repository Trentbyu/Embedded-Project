import React from 'react';
import Esp32Config from './compoents/esp32Config';
import Esp8266Config from './compoents/esp8266';
import { motion } from 'framer-motion';
import pageData from './HomePage.json'; // Import JSON directly

const Esp32ConfigPage = () => {
  return (
    <div className="min-h-screen flex flex-col py-10 bg-gray-500">
  {pageData.components.length > 0 && pageData.components.map((component, index) => (
    <div key={index} className="flex flex-col sm:flex-row my-5 sm:mb-2">
      <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
        {component.props.Device === 'ESP32' && (
          <Esp32Config
            apiEndpoint={component.props.imageSourceLink}
            containerId={component.props.containerId}
            ESPNAME={component.props.ESPNAME}
          />
        )}
        {component.props.Device === 'ESP8266' && (
          <Esp8266Config
            temperatureApiEndpoint={component.props.temperatureApiEndpoint}
            ESPNAME={component.props.ESPNAME}
          />
        )}
      </div>
    </div>
  ))}
</div>
  );
};

export default Esp32ConfigPage;


{/* <motion.div className="min-h-screen flex flex-col py-10 bg-gray-500"  initial={{ opacity: 0, x: -1000 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: 1 }}>
         <Navbar /> 
        <div className="flex flex-wrap">
            <Esp32Config apiEndpoint="http://192.168.0.100" ESPNAME="192.168.0.100" />
            <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
            <Esp8266Config apiEndpoint="http://192.168.0.99" ESPNAME="192.168.0.99"/>
        </div>
         <div className="flex flex-wrap">
            <Esp32Config apiEndpoint="http://192.168.0.100" ESPNAME="192.168.0.100"/>
            <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
            <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
        </div */} 