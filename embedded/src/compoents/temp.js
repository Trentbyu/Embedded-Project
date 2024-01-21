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

  return (
    <div className="mx-10">
      <div className="mb-4">
        {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="refreshInterval">
          Refresh Interval (ms):
        </label>
        <input
          id="refreshInterval"
          type="number"
          value={refreshInterval}
          onChange={handleIntervalChange}
          className="shadow appearance-none border rounded w-50 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        /> */}
      </div>

      <div>
        <p className="text-xl font-bold mb-2">{ESPNAME} Current Temperature:</p>
        {isLoading ? (
            <div>
                <p>Loading...</p>
            <LoadingSpinner />
                
            </div>
        ) : (
          <p className="text-3xl">{temperature !== null ? `${temperature} °C` : 'No Data'}</p>
        )}
      </div>
    </div>
  );
};

export default TemperatureViewer;
