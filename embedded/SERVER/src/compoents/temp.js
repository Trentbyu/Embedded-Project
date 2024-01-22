import React, { useState, useEffect } from 'react';
import LoadingSpinner from "./loading"
const TemperatureViewer = ({ temperatureApiEndpoint , ESPNAME }) => {
  const [temperature, setTemperature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(1000); // Initial refresh interval in milliseconds

  useEffect(() => {
    
  const fetchTemperature = async () => {
    try {
      const response = await fetch(`${temperatureApiEndpoint}/temperature`);
      const dataText = await response.text();

      // Extract the temperature value from the response text
      const temperatureMatch = dataText.match(/Temperature: (\d+\.\d+) C/);

      if (temperatureMatch && temperatureMatch.length >= 2) {
        const temperatureValue = parseFloat(temperatureMatch[1]);
        setTemperature(temperatureValue);
      } else {
        console.error('Invalid temperature response:', dataText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

    const intervalId = setInterval(fetchTemperature, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshInterval, temperatureApiEndpoint]);

  const handleIntervalChange = (event) => {
    const newInterval = parseInt(event.target.value, 10);
    setRefreshInterval(isNaN(newInterval) ? 10000 : newInterval);
  };
  const fillPercentage = temperature !== null ? Math.min(Math.max(temperature, 0), 100) : 0;

  return (
    <div className="flex items-center">
  <div>
    <p className="text-xl font-bold mb-2">{ESPNAME} Current Temperature:</p>
    {isLoading ? (
      <div className="text-center">
        <p>Loading...</p>
        <LoadingSpinner />
      </div>
    ) : (
      <p className="text-3xl">
        {temperature !== null ? `${temperature} °C` : 'NONE °C'}
      </p>
    )}
  </div>

  <div className="ml-10">
    {/* Thermometer visualization */}
    <div className="relative bg-gray-300 w-6 h-32 mx-auto mb-2 rounded-lg">
      <div
        className="absolute bg-gradient-to-t from-blue-300 to-red-500 bottom-0 rounded-lg left-0"
        style={{ width: '100%', height: `${25}%` }}
      ></div>
    </div>
  </div>
</div>

  );
};

export default TemperatureViewer;
