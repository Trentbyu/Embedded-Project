import React, { useState, useEffect } from 'react';
import LoadingSpinner from "./loading"
const TemperatureViewer = ({ temperatureApiEndpoint }) => {
  const [temperature, setTemperature] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10000); // Initial refresh interval in milliseconds

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch(temperatureApiEndpoint);
        const data = await response.json();

        setTemperature(data.temperature);
        setIsLoading(false); // Set loading to false once data is received
      } catch (error) {
        console.error('Error fetching temperature', error);
        setTimeout(fetchTemperature, 5000);
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

      <div>
        <p className="text-xl font-bold mb-2">Current Temperature:</p>
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
