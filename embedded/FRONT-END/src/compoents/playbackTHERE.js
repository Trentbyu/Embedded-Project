import React, { useState, useEffect } from 'react';
import ipAddress from '../index';
import GetPlayback from './getplaybaack';

function PlaybackFiles({  argument }) {
  const [files, setFiles] = useState([]);
  const [showPlayback, setShowPlayback] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showGif, setShowGif] = useState(true); 
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    fetch(`http://${ipAddress}:5000/playback_files?ip_address=${argument}`)
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
          <div className="p-4 border border-gray-300 rounded-md shadow-md">
            {showGif && <GetPlayback argument={selectedFile} />}
            <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => setShowGif(!showGif)}>
              {showGif ? 'Hide' : 'Show'} GIF
            </button>
            <button className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => setShowPlayback(false)}>Hide Get Playback</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaybackFiles;
