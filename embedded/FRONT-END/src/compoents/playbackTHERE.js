import React, { useState, useEffect } from 'react';
import ipAddress from '../index';
import GetPlayback from './getplaybaack';

function PlaybackFiles() {
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
    console.log(fileName)
  };

  return (
    <div className="p-4">
    <h2 className="text-xl font-bold mb-2">Playback Files:</h2>
    <ul className="list-disc pl-4">
      {files.map((file, index) => (
        <li key={index} className="cursor-pointer text-blue-500 hover:underline" onClick={() => handleClick(file)}>
          {file}
        </li>
      ))}
    </ul>
    {showPlayback && selectedFile && (
      <div>
        <GetPlayback argument={selectedFile} />
        <button onClick={() => setShowPlayback(false)}>Hide Get Playback</button>
      </div>
    )}
  </div>
  );
}

export default PlaybackFiles;
