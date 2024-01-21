import React, { useState, useEffect } from 'react';

const ActivityTracker = () => {
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    // Function to log user activity
    const logActivity = (action) => {
      const timestamp = new Date().toLocaleString();
      setActivityLog(prevLog => [...prevLog, { action, timestamp }]);
    };

    // Example usage: Log activity on component mount
    logActivity('Component mounted');

    // Clean up the log after component unmount
    return () => {
      logActivity('Component unmounted');
    };
  }, []); // Empty dependency array ensures useEffect runs only on mount and unmount

  return (
    <div>
      <h2>User Activity Log</h2>
      <ul>
        {activityLog.map((entry, index) => (
          <li key={index}>{`${entry.timestamp}: ${entry.action}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityTracker;
