import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ipAddress from '../index';
const ImageViewer = ({ imageSourceLink,ESPNAME }) => {
  const [refreshInterval, setRefreshInterval] = useState(40);
  const [intervalInput, setIntervalInput] = useState(1000); // State to hold the value of the interval input

  useEffect(() => {
    let i = 0; // Initialize the variable for constructing the image URL
    
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
        const imageURL = `http://${imageSourceLink}/video?${i++}`;

        // Set image source link
        imageElement.src = imageURL;

        imageElement.width = 800;
        imageElement.height = 400;
    };

    updateImageSource();
}, [refreshInterval, imageSourceLink]);

  // const handleIntervalChange = async () => {
  //   try {
  //     const response = await fetch(`http://${imageSourceLink}/set_interval?interval=${intervalInput}`, {
  //       method: 'GET'
  //     });

  //     if (!response.ok) {
  //       console.error('Error: Interval could not be set.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  // Event listener to handle page unload
    // useEffect(() => {
    //   const handleBeforeUnload = async () => {
    //     // Set intervalInput to 1000 before unloading the page
    //     setIntervalInput(1500);
    //     // Call the function to send the interval change request
    //     await handleIntervalChange();
    //   };

    //   window.addEventListener('beforeunload', handleBeforeUnload);

    //   return () => {
    //     window.removeEventListener('beforeunload', handleBeforeUnload);
    //   };
    // }, []);

  return (
    <motion.div
    initial={{ opacity: 0, x: 1500 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: 0.8 }}
    className='mx-10'
  >
    <div className="">
      <label className="block text-gray-700 text-sm font-bold" htmlFor="refreshInterval">
        Cam {ESPNAME}
      </label>
      {/* <select
        value={intervalInput}
        onChange={(e) => setIntervalInput(parseInt(e.target.value))}
        className="border border-gray-300 rounded-md p-2 px-5 mt-2"
      > 
        <option value="41">41</option>

        <option value="100">100</option>
        <option value="500">500</option>
        <option value="1000">1000</option>
        <option value="10000">10000</option>

      </select>
      <button onClick={handleIntervalChange} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
        Change Interval
      </button> */}
    </div>

    <motion.div
      id={imageSourceLink}
      className="max-w-full"
    >
      <motion.img
        className="w-600 h-300"
        alt={`Image from ${ESPNAME} camera`}
      />
    </motion.div>
  </motion.div>
  );
};

export default ImageViewer;
