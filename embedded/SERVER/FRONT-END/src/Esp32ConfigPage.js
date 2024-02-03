// Esp32ConfigPage.js
import React, { useState, useEffect } from 'react';
import Esp32Config from './compoents/esp32Config';
import Esp8266Config from './compoents/esp8266';
// import Navbar from './compoents/nav';
import { motion } from 'framer-motion';
import axios from 'axios';

const Esp32ConfigPage = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
      fetchElements();
  }, []);

  const fetchElements = () => {
      axios.get('http://127.0.0.1:8000/api/elements/')
          .then(response => {
              setElements(response.data);
          })
          .catch(error => {
              console.error('Error fetching elements:', error);
          });
  };

  const renderElement = (element) => {
      switch (element.device_type) {
          case 'ESP32':
            
              return  <Esp32Config apiEndpoint={element.ip_address} ESPNAME={element.ip_address} />;
          case 'ESP8266':
              return <Esp32Config apiEndpoint={element.ip_address} ESPNAME={element.ip_address}/> ;
          default:
              return null;
      }
  };
  return (

    <div className="min-h-screen flex flex-col py-10 bg-gray-500">
    <div>
        {/* <h2>Elements</h2> */}
        {elements.length === 0 ? (
            <div class="flex justify-center items-center h-screen">
            <div class="text-center">
                <p class="text-lg m-10">No Devices found.  
                    <a href="/Settings" class="text-blue-800 m-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded inline-flex items-center">
                        <span> Go to Settings to set one up</span>
                    </a>
                </p>
            </div>
        </div>
        ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {elements.map(element => (
                    <li key={element.id}>
                        {renderElement(element)}
                    </li>
                ))}
            </ul>
        )}
    </div>
</div>

    // <motion.div className="min-h-screen flex flex-col py-10 bg-gray-500"  initial={{ opacity: 0, x: -1000 }}
    // animate={{ opacity: 1, x: 0 }}
    // exit={{ opacity: 0, x: 100 }}
    // transition={{ duration: 1 }}>
    //     {/* <Navbar /> */}
    //     <div className="flex flex-wrap">
    //         <Esp32Config apiEndpoint="http://192.168.0.100" ESPNAME="192.168.0.100" />
    //         <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
    //         <Esp8266Config apiEndpoint="http://192.168.0.99" ESPNAME="192.168.0.99"/>
    //     </div>
    //     {/* <div className="flex flex-wrap">
    //         <Esp32Config apiEndpoint="http://192.168.0.100" ESPNAME="192.168.0.100"/>
    //         <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
    //         <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
    //     </div> */}
    //     </motion.div>

  );
};

export default Esp32ConfigPage;
