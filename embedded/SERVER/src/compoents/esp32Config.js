import React, { useState, useEffect } from 'react';

const Esp32Config = ({ apiEndpoint , ESPNAME}) => {
  const [sleepDuration, setSleepDuration] = useState('');
  const [temperature, setTemperature] = useState(null);

  
  const handleRestartClick = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/restart`, {
        method: 'GET', // You may need to change the HTTP method based on your API
      });

      if (response.ok) {
        console.log('Restart request successful');
        // Handle successful response, if needed
      } else {
        console.error('Failed to restart ESP32');
        // Handle error response, if needed
      }
    } catch (error) {
      console.error('Error while restarting ESP32:', error);
      // Handle any other errors that may occur
    }
  };

  const handleTemperatureClick = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/temperature`);
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

  const handleSleepDurationChange = async () => {
    // Check if sleepDuration is a valid number
    if (!isNaN(sleepDuration)) {
      try {
        const response = await fetch(`${apiEndpoint}/power?duration=${sleepDuration}`);
        const dataText = await response.text();

        // Process the response as needed
        console.log('Response:', dataText);

        // Update the sleep duration in the state
        setSleepDuration('');
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Invalid sleep duration');
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (!isNaN(inputValue)) {
      setSleepDuration(inputValue);
    }
  };

  // Assuming you have a function to send the value 60
  const sendValue = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/power?duration=18000`);
      const dataText = await response.text();
      console.log('Response:', dataText);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Schedule the function to run at 10 pm every day
  const scheduleAt10PM = () => {
    const now = new Date();
    let millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0) - now;
    if (millisTill10 < 0) {
      millisTill10 += 86400000; // It's already past 10 pm, schedule it for the next day
    }

    setTimeout(() => {
      sendValue();
      scheduleAt10PM(); // Reschedule for the next day
    }, millisTill10);
  };

  // Call this function to start the scheduling
//   scheduleAt10PM();
    useEffect(() => {
        const intervalId = setInterval(() => {
        handleTemperatureClick();
        }, 1000);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures that this effect runs once after the initial render


  return (
    <div className='my-10 mx-auto'>
    <div className="p-4 mx-auto border-4 border-gray-900 rounded">
        <h1 className="text-2xl font-bold mb-4">{ESPNAME}</h1>
        <p className="mt-4 font-bold  mb-2">
            {temperature !== null ? `ESP32 internal temp: ${temperature}°C` : 'ESP32 internal temp: None'}
        </p>

        {/* <div className=""> */}
        <label htmlFor="sleepDuration" className="block  mb-5">
            Sleep Duration (seconds):
        </label>
        <input
            type="number"
            id="sleepDuration"
            value={sleepDuration}
            onChange={handleInputChange}
            className="mb-1 border border-gray-300  p-2 rounded w-full "
        />
        {/* </div> */}
        <button
            onClick={handleSleepDurationChange}
            className="bg-green-500 text-white py-1 my-2 px-4 rounded-md w-full mt-4"
        >
            Enter
        </button>
        <button
            onClick={handleRestartClick}
            className="bg-black hover:bg-black text-white font-bold py-1 px-4 rounded w-full"
        >
            Restart ESP  
        </button>
        

   
   
    </div>
    </div>
  );
};

export default Esp32Config;
