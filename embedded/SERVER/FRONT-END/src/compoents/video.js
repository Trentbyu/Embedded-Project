import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000/video');

const VideoPlayer = () => {
  const [videoFrame, setVideoFrame] = useState('');

  useEffect(() => {
    socket.emit('get_video_frame');

    socket.on('video_frame', (data) => {
      setVideoFrame(`data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(data.frame)))}`);
    });

    return () => {
      socket.off('video_frame');
    };
  }, []);

  return (
    <div>
      <img src={videoFrame} alt="Video Frame" />
    </div>
  );
};

export default VideoPlayer;
