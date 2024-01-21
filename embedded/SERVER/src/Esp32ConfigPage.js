// Esp32ConfigPage.js
import React from 'react';
import Esp32Config from './compoents/esp32Config';
// import Navbar from './compoents/nav';

const Esp32ConfigPage = () => {
  return (
    <div className="min-h-screen flex flex-col py-10 bg-gray-500">
        {/* <Navbar /> */}
        <div className="flex flex-wrap">
            <Esp32Config apiEndpoint="http://192.168.0.100" ESPNAME="192.168.0.100" />
            <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
            <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
        </div>
        <div className="flex flex-wrap">
            <Esp32Config apiEndpoint="http://192.168.0.100" ESPNAME="192.168.0.100"/>
            <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
            <Esp32Config apiEndpoint="http://192.168.0.116" ESPNAME="192.168.0.116"/>
        </div>
        </div>

  );
};

export default Esp32ConfigPage;
