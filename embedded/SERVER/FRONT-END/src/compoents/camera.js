import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const ImageViewer = ({ imageSourceLink, containerId,ESPNAME }) => {
  const [refreshInterval, setRefreshInterval] = useState(1000);
  const [temperature, setTemperature] = useState(null); 
  const [sleepDuration, setSleepDuration] = useState('');
  let i = 0
  useEffect(() => {
    i++
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
          imageElement.src = `${imageSourceLink}/video?${i}`;
        }, refreshInterval);
      };

      imageElement.onerror = () => {
        console.error('Error loading image');
        setTimeout(updateImageSource, 500);
        
      };

      imageElement.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAA1BMVEUAAACnej3aAAAASElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC3AcUIAAFkqh/QAAAAAElFTkSuQmCC";
      
      imageElement.width = 400;
      imageElement.height = 300;

    };

    updateImageSource();
  }, [refreshInterval, imageSourceLink, containerId]);

  const handleIntervalChange = (event) => {
    const newInterval = parseInt(event.target.value, 10);
    setRefreshInterval(isNaN(newInterval) ? 1000 : newInterval);
  };

  
  
  
  

  return (
    <motion.div initial={{ opacity: 0, x: 1500 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: .8 }} 
    className='mx-10'>
      <div className="">
        <label className="block text-gray-700 text-sm font-bold" htmlFor="refreshInterval">
          Cam {ESPNAME}
        </label>
        <select
          id="refreshInterval"
          value={refreshInterval}
          onChange={handleIntervalChange}
          className="shadow appearance-none  rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-600"
        >
          <option value={25}>40 fps</option>
          <option value={41}>24 fps </option>
          <option value={100}>10 fps</option>
          <option value={500}>2 fps</option>
          <option value={1000}>1 fps</option>
        </select>
          
        
        </div>
        
        <motion.div
          id={containerId}
          className="max-w-full"
          
          // whileHover={{ scale: 1.5 }} // Zoom effect on hover
         
        >
          <motion.img
            className="w-400 h-300"
           
            // whileHover={{ scale: 1.5}} // Zoom effect on hover
           
          />
        </motion.div>


    </motion.div>
  );
};

export default ImageViewer;
