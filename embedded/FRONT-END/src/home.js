import React, { useState, useEffect } from 'react';
import ImageViewer from './compoents/camera';
import TemperatureViewer from './compoents/temp';
import AqiViewer from './compoents/aqi';
import HumidityViewer from './compoents/humidity';
import ipAddress from './index';
import Tvmount from './compoents/TV_mount';
const HomePage = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    fetch(`http://${ipAddress}:5000/api/components`)
      .then(response => response.json())
      .then(data => setComponents(data))
      .catch(error => console.error('Error fetching components:', error));
  }, []);

  // Group components by room
  const groupedComponents = components.reduce((acc, component) => {
    const { room } = component.props;
    if (!acc[room]) {
      acc[room] = [];
    }
    acc[room].push(component);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col py-10 bg-gray-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {Object.keys(groupedComponents).map((room, index) => (
          <div key={index} className="mx-4 mb-8">
            <h2 className="text-2xl text-left mb-3 mx-2">{room}</h2>
            <div>
              {groupedComponents[room].map((component, componentIndex) => (
                <div key={componentIndex} className="mx-auto p-4">
                  {component.type === 'ImageViewer' && (
                    <ImageViewer
                      imageSourceLink={component.props.imageSourceLink}
                      ESPNAME={component.props.ESPNAME}
                    />
                  )}
                  {component.type === 'TemperatureViewer' && (
                    <TemperatureViewer
                      temperatureApiEndpoint={component.props.imageSourceLink}
                      ESPNAME={component.props.ESPNAME}
                    />
                  )}
                  {component.type === 'AqiViewer' && (
                    <AqiViewer
                      aqiApiEndpoint={component.props.imageSourceLink}
                      ESPNAME={component.props.ESPNAME}
                    />
                  )}
                  {component.type === 'HumidityViewer' && (
                    <HumidityViewer 
                      humidityApiEndpoint={component.props.imageSourceLink}
                      ESPNAME={component.props.ESPNAME}
                    />
                  )}
                  {component.type === 'Tvmount' && (
                    <Tvmount 
                      humidityApiEndpoint={component.props.imageSourceLink}
                      ESPNAME={component.props.ESPNAME}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
