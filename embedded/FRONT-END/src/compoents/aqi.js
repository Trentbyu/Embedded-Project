import React, { useState, useEffect } from 'react';
import LoadingSpinner from "./loading"
import { motion } from 'framer-motion';

const AqiViewer = ({ aqiApiEndpoint , ESPNAME }) => {
  const [aqi, setAqi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prevaqi, setPrevaqi] = useState(null);

  useEffect(() => {
    const fetchAqi = async () => {
      try {
        const response = await fetch(`http://${aqiApiEndpoint}/aqi`);
        const data = await response.json();
    
        if (data && data.aqi !== undefined) {
          const aqiValue = data.aqi;
          setAqi(aqiValue);
          setPrevaqi(aqiValue);
        } else {
          console.error('Invalid aqi response:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    let counter = 0;
    const intervalId = setInterval(async () => {
      await fetchAqi();
      if (counter === 2) {
        counter = 0;
      }
      counter++;
    }, 1000);

    return () => clearInterval(intervalId);
  }, [prevaqi]);


  return (
    <motion.div initial={{ opacity: 0, x: 1500 }}
    animate={{ opacity: 2, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: 2 }} className="flex items-center">
      <div>
        <p className="text-xl font-bold mb-2">{ESPNAME} Current aqi:</p>
        {isLoading ? (
          <div className="text-center">
            <p>Loading...</p>
            <LoadingSpinner />
          </div>
        ) : (
          <p className="text-3xl">
            {aqi !== null ? `${aqi} ` : 'NONE '}
          </p>
        )}
        {/* <p>{aqi}</p> */}
      </div>
      <div>
      </div>
    </motion.div>
  );
};

export default AqiViewer;
