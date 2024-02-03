// TemperatureGraph.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const TemperatureGraph = () => {
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/temperature'); // Adjust the API endpoint according to your Django setup
        setTemperatureData(response.data);
      } catch (error) {
        console.error('Error fetching temperature data:', error);
      }
    };

    fetchData();
  }, []);

  const temperatureLabels = temperatureData.map(data => data.timestamp);
  const temperatureValues = temperatureData.map(data => data.value);

  const data = {
    labels: temperatureLabels,
    datasets: [
      {
        label: 'Temperature',
        data: temperatureValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Temperature Graph</h2>
      <Line data={data} />
    </div>
  );
};

export default TemperatureGraph;
