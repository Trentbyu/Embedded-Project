import React from 'react';
import ImageViewer from './compoents/camera';
import TemperatureViewer from './compoents/temp';
import pageData from './HomePage.json'; // Import JSON directly

const HomePage = () => {
  // Group components by room
  const groupedComponents = pageData.components.reduce((acc, component) => {
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
            <h2 className="text-xl mb-2">{room}</h2>
            <div>
              {groupedComponents[room].map((component, index) => (
                <div key={index} className="mx-auto p-4">
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
