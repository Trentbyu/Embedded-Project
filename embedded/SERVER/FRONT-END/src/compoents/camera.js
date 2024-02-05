import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ImageViewer = ({ imageSourceLink, ESPNAME }) => {
  const [refreshInterval, setRefreshInterval] = useState(100);
  let i = 0
  useEffect(() => {
    const updateImageSource = () => {
      const imageContainer = document.getElementById(imageSourceLink);

      if (!imageContainer) {
        console.error(`Element with id "${imageSourceLink}" not found`);
        return;
      }

      let imageElement = imageContainer.querySelector("img");

      if (!imageElement) {
        imageElement = document.createElement("img");
        imageContainer.appendChild(imageElement);
      }

      imageElement.onload = () => {
        setTimeout(updateImageSource, refreshInterval); // Refresh image after interval
      };

      imageElement.onerror = () => {
        console.error('Error loading image');
        setTimeout(updateImageSource, 500); // Retry after 500ms if there's an error
      };

      // Construct the image source URL with the provided IP address
      const imageURL = `http://192.168.0.156:5000/api/get_image/${imageSourceLink}?${i++}`;

      // Set image source link
      imageElement.src = imageURL;

      imageElement.width = 400;
      imageElement.height = 300;
    };

    updateImageSource();
  }, [refreshInterval, imageSourceLink]);

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
      className='mx-10'>
      <div className="">
        <label className="block text-gray-700 text-sm font-bold" htmlFor="refreshInterval">
          Cam {ESPNAME}
        </label>
        <select
          id="refreshInterval"
          value={refreshInterval}
          onChange={handleIntervalChange}
          className="shadow appearance-none rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-600"
        >
          <option value={1000}>Refresh every 1 second</option>
          <option value={2000}>Refresh every 2 seconds</option>
          <option value={5000}>Refresh every 5 seconds</option>
          {/* Add more options as needed */}
        </select>
      </div>

      <motion.div
        id={imageSourceLink}
        className="max-w-full"
      >
        <motion.img
          className="w-400 h-300"
          alt={`Image from ${ESPNAME} camera`}
        />
      </motion.div>
    </motion.div>
  );
};

export default ImageViewer;
