import React, { useState, useEffect } from 'react';
import ipAddress from '../index';
function PlaybackFiles({}) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch(`http://${ipAddress}:5000/playback_files`)
      .then(response => response.json())
      .then(data => {
        setFiles(data);
      })
      .catch(error => {
        console.error('Error fetching playback files:', error);
      });
  }, [ipAddress]);

  return (
    <div>
      <h2>Playback Files:</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlaybackFiles;
