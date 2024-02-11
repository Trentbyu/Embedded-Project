import React, { useState, useEffect } from 'react';

function GetPlayback() {
  const [gif, setGif] = useState('');

  useEffect(() => {
    fetch('/gif')
      .then(response => {
        // Assuming the response is a blob
        return response.blob();
      })
      .then(blob => {
        // Convert the blob into a URL
        const gifUrl = URL.createObjectURL(blob);
        setGif(gifUrl);
      })
      .catch(error => {
        console.error('Error fetching GIF:', error);
      });
  }, []);

  return (
    <div>
      {gif && <img src={gif} alt="GIF" />}
    </div>
  );
}

export default GetPlayback;
