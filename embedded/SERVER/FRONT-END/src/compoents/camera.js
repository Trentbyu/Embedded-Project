import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const ImageViewer = ({ imageSourceLink, containerId,ESPNAME }) => {
  const [refreshInterval, setRefreshInterval] = useState(1000);
  const [temperature, setTemperature] = useState(null); 
  const [sleepDuration, setSleepDuration] = useState('');
  const [i, setI] = useState(0);
  useEffect(() => {
    const updateImageSource = () => {
      const imageContainer = document.getElementById(containerId);

      if (!imageContainer) {
        console.error(`Element with id "${containerId}" not found`);
        return;
      }

      let imageElement = imageContainer.querySelector("img");

      if (!imageElement) {
        imageElement = document.createElement("img");
        imageContainer.appendChild(imageElement);
      }

      imageElement.onload = () => {
        setTimeout(() => {
          setI(prevI => prevI + 1); // Increment i after the image has loaded
        }, refreshInterval);
      };

      imageElement.onerror = () => {
        console.error('Error loading image');
        setTimeout(updateImageSource, 500);
      };

      imageElement.src = `http://${imageSourceLink}/video?${i}`;
      imageElement.width = 400;
      imageElement.height = 300;
    };

    updateImageSource();
  }, [refreshInterval, imageSourceLink, containerId, i]);

  const handleIntervalChange = (event) => {
    const newInterval = parseInt(event.target.value, 10);
    setRefreshInterval(isNaN(newInterval) ? 1000 : newInterval);
  };

  
  
  
  

  return (
    <motion.div 
  initial={{ opacity: 0, x: 1500 }} 
  animate={{ opacity: 1, x: 0 }} 
  exit={{ opacity: 0, x: 100 }} 
  transition={{ duration: 0.8 }} 
  className='mx-10 h-300' // Set a fixed height for the motion div
>
  <div className="flex flex-col h-full"> {/* Ensure flex container stretches to fill height */}
    <label className="block text-gray-700 text-sm font-bold h-20" htmlFor="refreshInterval"> {/* Set fixed height for label */}
      Cam {ESPNAME}
    </label>
    <select
      id="refreshInterval"
      value={refreshInterval}
      onChange={handleIntervalChange}
      className="shadow appearance-none rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-600 h-10" // Set fixed height for select
    >
      <option value={25}>40 fps</option>
      <option value={41}>24 fps </option>
      <option value={100}>10 fps</option>
      <option value={500}>2 fps</option>
      <option value={1000}>1 fps</option>
    </select>
    
    <motion.div
      id={containerId}
      className="max-w-full flex-grow" // Ensure image container takes up remaining space
    >
      <motion.img
        className="w-full h-full object-cover" // Set image to cover container
        // src={imageSource} // Replace with your image source
        alt="Image"
      />
    </motion.div>
  </div>
</motion.div>
  );
};

export default ImageViewer;
