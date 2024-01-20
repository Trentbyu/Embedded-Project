import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <nav className="bg-black p-4">
      <div className="flex items-center justify-center">
        <div className="text-white">{currentTime.toLocaleTimeString()}</div>
      </div>
    </nav>
  );
};

export default Navbar;
