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
    <div className='my-10 mx-auto'>
    <div className="p-4 mx-auto border-4 border-gray-900 rounded">
        <h1 className="text-2xl font-bold mb-4">{ESPNAME}</h1>
      

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

export default Esp8266Config;
