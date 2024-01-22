// HomePage.js
import React from 'react';
import ImageViewer from './compoents/camera';
import TemperatureViewer from './compoents/temp';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col py-10 bg-gray-500">
      {/* First row of components */}
      <div className="flex flex-col sm:flex-row my-5 sm:mb-2">
        <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
          {/* ImageViewer component */}
          <ImageViewer imageSourceLink={"http://192.168.0.116"} containerId="192.168.0.116" />
        </div>
        <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
          {/* TemperatureViewer component */}
          <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} ESPNAME="Inside"/>
        </div>
        <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
          {/* TemperatureViewer component */}
          <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} ESPNAME="Oustide"/>
        </div>
      </div>

      {/* Second row of components */}
      <div className="flex flex-col sm:flex-row py-10 ">
        <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
          {/* ImageViewer component */}
          <ImageViewer imageSourceLink={"http://192.168.0.100"} containerId="192.168.0.100" />
        </div>
        <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
          {/* TemperatureViewer component */}
          <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} />
        </div>
        <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
          {/* TemperatureViewer component */}
          <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
