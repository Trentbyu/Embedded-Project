import React, { useState, useEffect } from 'react';
import ipAddress from '../index';

function GetPlayback({ argument }) {
    const [gif, setGif] = useState('');
    const [playing, setPlaying] = useState(true); // State to manage playing/pausing
    const [currentTime, setCurrentTime] = useState(0); // State to manage current time

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://${ipAddress}:5000/gif?argument=${argument}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const blob = await response.blob();
                const gifUrl = URL.createObjectURL(blob);
                setGif(gifUrl);
            } catch (error) {
                console.error('Error fetching GIF:', error);
            }
        };

        fetchData();
    }, [ipAddress, argument]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (playing) {
                setCurrentTime(prevTime => prevTime + 1); // Increment currentTime every second
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [playing]);

    const togglePlay = () => {
        setPlaying(prevPlaying => !prevPlaying);
    };

    const jumpForward = () => {
        const video = document.getElementById('gif');
        if (video) {
            video.currentTime += 5; // Jump forward 5 seconds, adjust this as needed
        }
    };

    return (
        <div className="flex flex-col items-center">
            {gif && (
                <div>
                    <img id="gif" className="w-full rounded-lg shadow-lg" src={gif} alt="GIF" />
                    <div className="mt-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={togglePlay}>
                            {playing ? 'Pause' : 'Play'}
                        </button>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={jumpForward}>
                            Jump Forward
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetPlayback;
