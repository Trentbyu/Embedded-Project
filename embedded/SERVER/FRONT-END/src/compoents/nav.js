import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

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
      <div className="flex items-center justify-between">
        {/* Clock */}
        <div className="text-white">{currentTime.toLocaleTimeString()}</div>

        {/* Navigation Links */}
        <div className="flex">
          <Link to="/" className="text-white mx-4">Home</Link>
          <Link to="/config" className="text-white mx-4">Esp32 Config</Link>
          <Link to="/settings" className="text-white mx-4">Settings</Link>

          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
