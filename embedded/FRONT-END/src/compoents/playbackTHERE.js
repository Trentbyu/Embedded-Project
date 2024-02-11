import React, { useState, useEffect } from 'react';
import ipAddress from '../index';
import GetPlayback from './getplaybaack';

function PlaybackFiles({  }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    fetch(`http://${ipAddress}:5000/playback_files`)
      .then(response => response.json())
      .then(data => {
        setFiles(data);
      })
      .catch(error => {
        console.error('Error fetching playback files:', error);
      });
  };

  const handleClick = (fileName) => {
    setSelectedFile(fileName);
  };

  return (
    <div>
      <h2>Playback Files:</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index} onClick={() => handleClick(file)}>
            {file}
          </li>
        ))}
      </ul>
      {selectedFile && (
        <GetPlayback  argument={selectedFile} />
      )}
    </div>
  );
}

export default PlaybackFiles;
