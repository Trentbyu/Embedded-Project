// ImageViewer.jsx

import React, { useState, useEffect } from 'react';
// import './styles.css'; // Import the styles file

const ImageViewer = ({ imageSourceLink }) => {
  const [refreshInterval, setRefreshInterval] = useState(1000); // Initial refresh interval in milliseconds

  useEffect(() => {
    const updateImageSource = () => {
      const imageContainer = document.getElementById("imageContainer");

      let imageElement = imageContainer.querySelector("img");

      if (!imageElement) {
        imageElement = document.createElement("img");
        imageContainer.appendChild(imageElement);
      }

      imageElement.onload = () => {
        setTimeout(() => {
          imageElement.src = `${imageSourceLink}?${new Date().getTime()}`;
        }, refreshInterval);
      };

      imageElement.onerror = () => {
        console.error('Error loading image');
        setTimeout(updateImageSource, 500);
      };

      imageElement.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFZK0KsHhaYzjvztVp5oAbItdJiiWniDyATA&usqp=CAU";
      imageElement.width = 800;
      imageElement.height = 600;
    };

    updateImageSource();
  }, [refreshInterval, imageSourceLink]);

  const handleIntervalChange = (event) => {
    const newInterval = parseInt(event.target.value, 10);
    setRefreshInterval(isNaN(newInterval) ? 1000 : newInterval);
  };

  return (
    <div className='mx-10'>
      <div className="mb-4 ">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="refreshInterval">
          Refresh Interval (ms):
        </label>
        <input
          id="refreshInterval"
          type="number"
          value={refreshInterval}
          onChange={handleIntervalChange}
          className="shadow appearance-none border rounded w-50 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div id="imageContainer" className="max-w-full "></div>
    </div>
  );
};

export default ImageViewer;
