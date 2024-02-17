import React, { useState, useEffect } from 'react';
import LoadingSpinner from "./loading"
import { motion, useAnimation } from 'framer-motion';
const HumidityViewer  = ({ humidityApiEndpoint , ESPNAME }) => {
  const [humidity, setHumidity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prevhumidity, setPrevhumidity] = useState(null);


  useEffect(() => {
    // Fetch the current power state upon component mount
  

    // Fetch humidity
    const fetchhumidity = async () => {
      try {
        const response = await fetch(`http://${humidityApiEndpoint}/humidity`);
        const data = await response.json();
    
        if (data && data.humidity !== undefined) {
          const humidityValue = parseFloat(data.humidity);
          setHumidity(humidityValue);
    
          // Check for humidity changes
          // if (humidityValue !== prevhumidity) {
          //   console.log('humidity changed:', humidityValue);
          // }
          setPrevhumidity(humidityValue);
        } else {
          console.error('Invalid humidity response:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch power state and humidity every second
    let counter = 0;
    const intervalId = setInterval(async () => {
      await fetchhumidity();

      // Fetch power state every 2 seconds
      
      if (counter == 2) {
        // await fetchPowerState();
        counter = 0
      }
      counter++;
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [ prevhumidity]);
  const fillPercentage = humidity !== null ? Math.min(Math.max(humidity, 10), 100) : 0;


  return (
    <motion.div  initial={{ opacity: 0, x: 1500 }}
    animate={{ opacity: 2, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: 2 }}className="flex items-center">
  <div>
    <p className="text-xl font-bold mb-2">{ESPNAME} Current humidity:</p>
    {isLoading ? (
      <div className="text-center">
        <p>Loading...</p>
        <LoadingSpinner />
      </div>
    ) : (
      <p className="text-3xl">
        {humidity !== null ? `${humidity} °%` : 'NONE °%'}
      </p>
    )}
  </div>

  <div className="ml-10">
    {/* Thermometer visualization */}
    <motion.div whileHover={{ scale: 2}} className="relative bg-gray-300 w-6 h-32 mx-auto mb-2 rounded-lg">
      <div
        className="absolute bg-gradient-to-t from-yellow-400 to-blue-700 bottom-0 rounded-lg left-0"
        style={{ width: '100%', height: `${fillPercentage}%` }}
      ></div>
    </motion.div>
  </div>
</motion.div>

  );
};

export default HumidityViewer ;
