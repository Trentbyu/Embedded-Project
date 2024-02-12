import React, { useState, useEffect } from 'react';

const Esp8266Config = ({ apiEndpoint , ESPNAME}) => {
  const [sleepDuration, setSleepDuration] = useState('');


  
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




  return (
    <div className='my-10 mx-10 bg-gray-400'> 
    <div className="p-8 mx-auto border-8 border-gray-900 rounded">
      <h1 className="text-xl text-black   font-bold mb-4">ESP8266 </h1>

      <h1 className="text-xl text-white text-center bg-black p-2 font-bold mb-4">{ESPNAME} </h1>
          

        {/* <div className=""> */}
        <div className="flex flex-row items-center my-5">
          <label htmlFor="sleepDuration" className="block font-bold">
            Sleep (seconds):
          </label>
          <input
            type="number"
            id="sleepDuration"
            value={sleepDuration}
            onChange={handleInputChange}
            min="0"
            className="ml-2 border border-gray-300 p-2 rounded w-1/4"
          />
          <button
            onClick={handleSleepDurationChange}
            className="ml-2 bg-green-500 text-white py-1 px-4 rounded-md"
          >
            Enter
          </button>
        </div>
        <button
            onClick={handleRestartClick}
            className="bg-black hover:bg-black text-white font-bold py-3 px-4 rounded w-full"
        >
            Restart ESP  
        </button>
        

   
   
    </div>
    </div>
  );
};

export default Esp8266Config;
