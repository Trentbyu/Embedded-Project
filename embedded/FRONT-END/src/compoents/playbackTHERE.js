import React, { useState, useEffect } from 'react';
import ipAddress from '../index';
import GetPlayback from './getplaybaack';

function PlaybackFiles({ argument }) {
  const [files, setFiles] = useState([]);
  const [showPlayback, setShowPlayback] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false); 
  const [showGif, setShowGif] = useState(true); 
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    fetch(`http://${ipAddress}:5000/playback_files?ip_address=${argument}`)
      .then(response => response.json())
      .then(setFiles)
      .catch(error => {
        console.error('Error fetching playback files:', error);
      });
  };

  const handleClick = (fileName) => {
    setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, fileName]); // Add the selected file to the state array
  };

  function groupFilesByDate(files) {
    const groupedFiles = {};
    files.forEach(file => {
      const date = extractDateFromFilename(file);
      if (!groupedFiles[date]) {
        groupedFiles[date] = [];
      }
      groupedFiles[date].push(file);
    });
    return groupedFiles;
  }
  
  function extractDateFromFilename(filename) {
    const regex = /video_(\d{4})_(\d{2})_(\d{2})_/;
    const match = filename.match(regex);
    if (match) {
      const year = match[1];
      const month = match[2];
      const day = match[3];
      return `${year}-${month}-${day}`;
    }
    return null;
  }

  const filteredFiles = selectedDate ? files.filter(file => extractDateFromFilename(file) === selectedDate) : files;

  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">Playback Files:</h2>
      <input type="date" className="border border-gray-300 rounded-md p-1 mb-1" onChange={e => setSelectedDate(e.target.value)}/>
      <button className="mx-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-white hover:text-black " onClick={() => setShowFiles(!showFiles)}>
        {showFiles ? 'Hide Files' : 'Show Files'}
      </button>
      {showFiles && (
        <div>
          {Object.entries(groupFilesByDate(filteredFiles.filter(file => file.endsWith('.mp4')))).map(([date, videos], index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mt-4 mb-2">{date}</h3>
              <ul className="list-disc pl-4">
                {videos.map((video, idx) => (
                  <li key={idx} className="flex items-center mb-2">
                    <button className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => handleClick(video)}>Play</button>
                    <span className="cursor-pointer text-blue-200 hover:underline" onClick={() => handleClick(video)}>
                      {video}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {selectedFiles.map((file, index) => (
        <div key={index}>
          <div className="p-4 border border-gray-300 rounded-md shadow-md">
            <GetPlayback argument={file} espIp={argument}/>
            <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => setSelectedFiles(prevSelectedFiles => prevSelectedFiles.filter(selectedFile => selectedFile !== file))}>Hide Get Playback</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlaybackFiles;
