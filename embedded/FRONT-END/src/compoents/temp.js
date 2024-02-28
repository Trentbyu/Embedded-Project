import React, { useState, useEffect } from 'react';
import LoadingSpinner from "./loading"
import { motion, useAnimation } from 'framer-motion';
const TemperatureViewer = ({ temperatureApiEndpoint , ESPNAME }) => {
  const [temperature, setTemperature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10000); // Initial refresh interval in milliseconds
  const [prevTemperature, setPrevTemperature] = useState(null);


  useEffect(() => {
    // Fetch the current power state upon component mount
  

    // Fetch temperature
    const fetchTemperature = async () => {
      try {
        const response = await fetch(`http://${temperatureApiEndpoint}/temperature`);
        const data = await response.json();
    
        if (data && data.temperature !== undefined) {
          const temperatureValue = parseFloat(data.temperature);
          setTemperature(temperatureValue);
    
          // Check for temperature changes
          // if (temperatureValue !== prevTemperature) {
          //   console.log('Temperature changed:', temperatureValue);
          // }
          setPrevTemperature(temperatureValue);
        } else {
          console.error('Invalid temperature response:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch power state and temperature every second
    let counter = 0;
    const intervalId = setInterval(async () => {
      await fetchTemperature();

      // Fetch power state every 2 seconds
      
      if (counter == 2) {
        // await fetchPowerState();
        counter = 0
      }
      counter++;
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [ prevTemperature]);
  const fillPercentage = temperature !== null ? Math.min(Math.max(temperature, 10), 100) : 0;


  return (
    <motion.div  initial={{ opacity: 0, x: 1500 }}
    animate={{ opacity: 2, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: 2 }}className="flex items-center">
  <div>
    <p className="text-xl font-bold mb-2">{ESPNAME} Current Temperature:</p>
    {isLoading ? (
      <div className="text-center">
        <p>Loading...</p>
        <LoadingSpinner />
      </div>
    ) : (
      <p className="text-3xl">
        {temperature !== null ? `${temperature} °F` : 'NONE °C'}
      </p>
    )}
  </div>

  <div className="ml-10">
    {/* Thermometer visualization */}
    <motion.div whileHover={{ scale: 2}} className="relative bg-gray-300 w-6 h-32 mx-auto mb-2 rounded-lg">
      <div
        className="absolute bg-gradient-to-t from-blue-400 to-red-700 bottom-0 rounded-lg left-0"
        style={{ width: '100%', height: `${fillPercentage}%` }}
      ></div>
    </motion.div>
  </div>
</motion.div>

  );
};

export default TemperatureViewer;
