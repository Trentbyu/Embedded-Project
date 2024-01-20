
import React from 'react';
import ImageViewer from './compoents/camera';
import TemperatureViewer from './compoents/temp';

import Navbar from './compoents/nav';



const App = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col py-10">

      {/* First set of components */}
      <div className="flex flex-row mb-4">
        <div className=" h-600">
          {/* ImageViewer component */}
          <ImageViewer imageSourceLink={"http://192.168.0.116/video?"} />
        </div>

        <div className=" h-600">
          {/* TemperatureViewer component */}
          <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} />
        </div>

        <div className=" h-600">
          {/* TemperatureViewer component */}
          <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} />
        </div>

        <div className=" h-600">
          {/* TemperatureViewer component */}
          <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} />
        </div>
        <div className=" h-600">
          {/* TemperatureViewer component */}
          <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} />
        </div><div className=" h-600">
          {/* TemperatureViewer component */}
          <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} />
        </div>
      </div>

    

   

</div>



   



      
    </div>
  );
};

export default App;

