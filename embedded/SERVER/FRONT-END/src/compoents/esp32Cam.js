import React, { useState, useEffect } from 'react';

const Esp32CamConfig = ({ apiEndpoint , ESPNAME}) => {
  const [sleepDuration, setSleepDuration] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [selectedPowerState, setSelectedPowerState] = useState('');
  const [currentPowerState, setCurrentPowerState] = useState('');
  const [prevTemperature, setPrevTemperature] = useState(null);
  const [prevPowerState, setPrevPowerState] = useState('');
  const powerStates = ['240', '160', '80'];

  const handlePowerStateChange = (event) => {
    setSelectedPowerState(event.target.value);
  };

  
  const handleRestartClick = async () => {
    try {
      const response = await fetch(`http://${apiEndpoint}/restart`, {
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
        const response = await fetch(`http://${apiEndpoint}/sleep?duration=${sleepDuration}`);
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

  const handlePowerStateClick = async () => {
    try {
      const response = await fetch(`http://${apiEndpoint}/power?state=${selectedPowerState}`, {
        method: 'GET',
      });
  
      if (response.ok) {
        console.log(`Power state set to ${selectedPowerState}`);
        setCurrentPowerState(selectedPowerState); // Update the current power state
      } else {
        console.error(`Failed to set power state to ${selectedPowerState}`);
      }
    } catch (error) {
      console.error('Error while setting power state:', error);
    }
  };

  
  

  // Call this function to start the scheduling
//   scheduleAt10PM();
      
  useEffect(() => {
    // Fetch the current power state upon component mount
    const fetchPowerState = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/power`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentPowerState(data.powerState || '');
          setSelectedPowerState(data.powerState || '');
        } else {
          console.error('Failed to fetch current power state');
        }
      } catch (error) {
        console.error('Error while fetching current power state:', error);
      }
    };

    // Fetch temperature
    const fetchTemperature = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/temperature`);
        const dataText = await response.text();
        const temperatureMatch = dataText.match(/Temperature: (\d+\.\d+) C/);

        if (temperatureMatch && temperatureMatch.length >= 2) {
          const temperatureValue = parseFloat(temperatureMatch[1]);
          setTemperature(temperatureValue);

          // Check for temperature changes
          if (temperatureValue !== prevTemperature) {
            console.log('Temperature changed:', temperatureValue);
          }
          setPrevTemperature(temperatureValue);
        } else {
          console.error('Invalid temperature response:', dataText);
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
        await fetchPowerState();
        counter = 0
      }
      counter++;
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [apiEndpoint, prevTemperature]);



  return (
    <div className='my-10 mx-auto'>
    <div className="p-4 mx-auto border-4 border-gray-900 rounded">
        <h1 className="text-2xl font-bold mb-4">{ESPNAME} - Esp32</h1>
        <p className="mt-4 font-bold  mb-2">
            {temperature !== null ? `ESP32 internal temp: ${temperature}°C` : 'ESP32 internal temp: None'}
        </p>
        <label htmlFor="currentPowerState" className="block my-1 font-bold">
          Current Power State: {currentPowerState ? `${currentPowerState} Mhz` : 'None'}
           </label>
        
        <div className="flex flex-col items-left space-y-4 mb-2">
        {/* Top Row: Sleep */}
        <div className="flex flex-row items-center">
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

        {/* Bottom Row: Power State */}
        <div className="flex flex-row items-center">
          <label htmlFor="powerState" className="block font-bold">
            Power State:
          </label>
          <select
            id="powerState"
            value={selectedPowerState}
            onChange={handlePowerStateChange}
            className="ml-8 border border-gray-300 p-2 rounded w-1/4"
          >
            {powerStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <button
            onClick={handlePowerStateClick}
            className="ml-2 bg-blue-500 text-white py-1 px-4 rounded-md"
          >
            Set Power
          </button>
        </div>
      </div>


        
        <button
            onClick={handleRestartClick}
            className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded w-full"
        >
            Restart ESP  
        </button>

        

   
   
    </div>
    </div>
  );
};

export default Esp32CamConfig;
