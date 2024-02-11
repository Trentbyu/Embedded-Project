import React, { useState, useEffect, useRef } from 'react';
import ipAddress from '../index';

function GetPlayback({ argument }) {
    const [videoUrl, setVideoUrl] = useState('');
    const [playing, setPlaying] = useState(true); // State to manage playing/pausing
    const [currentTime, setCurrentTime] = useState(0); // State to manage current time
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://${ipAddress}:5000/gif?argument=${argument}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const blob = await response.blob();
                const videoUrl = URL.createObjectURL(blob);
                setVideoUrl(videoUrl);
            } catch (error) {
                console.error('Error fetching GIF:', error);
            }
        };

        fetchData();
    }, [ipAddress, argument]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (playing) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        }
    }, [playing]);

    const togglePlay = () => {
        setPlaying(prevPlaying => !prevPlaying); // Toggle playing state
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    return (
        <div className="flex flex-col items-center">
            {videoUrl && (
                <div>
                    <video
                        ref={videoRef}
                        className="w-full rounded-lg shadow-lg"
                        src={videoUrl}
                        onTimeUpdate={handleTimeUpdate}
                        autoPlay
                    />
                    <div className="mt-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={togglePlay}>
                            {playing ? 'Pause' : 'Play'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetPlayback;
