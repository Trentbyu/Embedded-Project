import React, { useState, useEffect } from 'react';
import ImageViewer from './compoents/camera';
import TemperatureViewer from './compoents/temp';
import pageData from './HomePage.json'; // Import JSON directly
import GetPlayback from './compoents/getplaybaack';
const HomePage = ({ })=> {
  // No need to use useState for pageData if it's static
  // const [pageData, setPageData] = useState(null);

  // No need for useEffect if pageData is static

  return (
    <div className="min-h-screen flex flex-col py-10 bg-gray-500">
      {pageData.components.map((component, index) => (
        <div key={index} className="flex flex-col sm:flex-row my-5 sm:mb-2">
          <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
            {component.type === 'ImageViewer' && (
              <ImageViewer
                imageSourceLink={component.props.imageSourceLink}
                // IP={ipAddress}
                ESPNAME={component.props.ESPNAME}
              />
            )}
            {component.type === 'TemperatureViewer' && (
              <TemperatureViewer
                temperatureApiEndpoint={component.props.imageSourceLink}
                ESPNAME={component.props.ESPNAME}
              />
            )}
          </div>
        </div>
      ))}
      <GetPlayback argument={"video_2024_02_11_01"}/>

    </div>
  );
};

export default HomePage;
