// HomePage.js
import React, { useState, useEffect } from 'react';
import ImageViewer from './compoents/camera';
import TemperatureViewer from './compoents/temp';
import axios from 'axios';
import { Link } from 'react-router-dom';
const HomePage = () => {
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
      switch (element.element_type) {
          case 'ImageViewer':
            
              return <ImageViewer imageSourceLink={element.ip_address} containerId={element.ip_address} ESPNAME={element.ESPNAME} />;
          case 'TemperatureViewer':
              return <TemperatureViewer temperatureApiEndpoint={element.ip_address} ESPNAME={element.ESPNAME}/> ;
          default:
              return null;
      }
  };
  return (
    <div className="min-h-screen flex flex-col py-1 bg-gray-500">
    <div>
        {/* <h2>Elements</h2> */}
        {elements.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {elements.map(element => (
                    <li key={element.id}>
                        {renderElement(element)}
                    </li>
                ))}
            </ul>
        ) : (
            <div class="flex justify-center items-center h-screen">
            <div class="text-center">
                <p class="text-lg m-10">No Devices found.  
                    <a href="/Settings" class="text-blue-800 m-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded inline-flex items-center">
                        <span> Go to Settings to set one up</span>
                    </a>
                </p>
            </div>
        </div>

        )}
    </div>
</div>
    //   {/* First row of components */}
    //   <div className="flex flex-col sm:flex-row my-5 sm:mb-2">
    //     <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
         
    //     </div>
    //     <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
    //       {/* TemperatureViewer component */}
    //       {/* <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} ESPNAME="Inside"/> */}
    //     </div>
    //     <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
    //       {/* TemperatureViewer component */}
    //       {/* <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} ESPNAME="Oustide"/> */}
    //     </div>
    //   </div>

    //   {/* Second row of components */}
    //   <div className="flex flex-col sm:flex-row py-10 ">
    //     <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
    //       {/* ImageViewer component */}
    //       {/* <ImageViewer imageSourceLink={"http://192.168.0.100"} containerId="192.168.0.100" ESPNAME="Oustide"/> */}
    //     </div>
    //     <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
    //       {/* TemperatureViewer component */}
    //       {/* <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} ESPNAME="Oustide" /> */}
    //     </div>
    //     <div className="h-300 mx-auto p-4 mb-4 sm:mb-0">
    //       {/* TemperatureViewer component */}
    //       {/* <TemperatureViewer temperatureApiEndpoint={"temperatureApiEndpoint"} ESPNAME="Oustide"/> */}
    //     </div>
    //   </div>
    // </div>
  );
};

export default HomePage;
