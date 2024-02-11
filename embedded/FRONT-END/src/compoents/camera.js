import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ipAddress from '../index';
import PlaybackFiles from './playbackTHERE';

const ImageViewer = ({ imageSourceLink,ESPNAME }) => {
  const [refreshInterval, setRefreshInterval] = useState(40);

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

        imageElement.width = 600;
        imageElement.height = 300;
    };

    updateImageSource();
}, [refreshInterval, imageSourceLink]);

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

    </div>

    <motion.div
      id={imageSourceLink}
      className="max-w-full"
    >
      <motion.img
        className="w-600 h-300"
        alt={`Image from ${ESPNAME} camera`}
      />
      <PlaybackFiles argument={imageSourceLink} />

    </motion.div>
  </motion.div>
  );
};

export default ImageViewer;
