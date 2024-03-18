import React, { useState, useEffect } from 'react';

const Tvmount = ({ apiEndpoint , ESPNAME}) => {
  const [moveTV, setMoveTV] = useState('');

  const handlemoveTVChange = async () => {
    // Check if moveTV is a valid number
    if (!isNaN(moveTV)) {
      try {
        const response = await fetch(`http://${apiEndpoint}/tv?move=${moveTV}`);
        const dataText = await response.text();


        console.log('Response:', dataText);

        setMoveTV('');
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Invalid tv duration');
    }
  };

  const handleInputChange = (event) => {
    const inputValue = Number(event.target.value); // Convert input value to a number
    if (!isNaN(inputValue)) {
      // Check if the input value is a valid number
      const newValue = Math.min(Math.max(inputValue, 0), 90); // Ensure the value stays within the range [0, 90]
      setMoveTV(newValue);
    }
  };


  return (
    <div className='my-10 sm:mx-0 mx-10 '> 
        
    {/* Top Row: Sleep */}
    <div className="flex flex-row items-center">
     <label htmlFor="moveTV" className="block font-bold">
       Angle :
     </label>
     <input
       type="number"
       id="moveTV"
       value={moveTV}
       onChange={handleInputChange}
       min="0"
       max="90"
       className="ml-2 border border-gray-300 p-2 rounded w-1/4 relative"
      
     />
     
   </div>  
   
   <div className="flex flex-row mt-10">
        <button
        onClick={() => {
          const newValue = Number(moveTV) + 10;
          handleInputChange({ target: { value: newValue > 90 ? 90 : newValue } });
          handlemoveTVChange();
        }}
        className="bg-gray-200 text-gray-600 py-4 px-4 w-1/4  rounded-md mb-1"
        style={{ transform: 'translateY(-50%)' }}
      >
        &#9650; {/* Up arrow HTML entity */}
      </button>
      <button
        onClick={() => {
          const newValue = Number(moveTV) - 10;
          handleInputChange({ target: { value: newValue < 0 ? 0 : newValue } });
          handlemoveTVChange();
        }}
        className="bg-gray-200 text-gray-600 py-4 px-4 w-1/4  rounded-md"
        style={{ transform: 'translateY(-50%)' }}
      >
        &#9660; {/* Down arrow HTML entity */}
      </button>
     </div>

</div>
  );
};

export default Tvmount;
