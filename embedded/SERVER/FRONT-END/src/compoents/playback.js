import React, { useState, useEffect } from 'react';

function VideoPlayer() {
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/get-video')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                setVideoSrc(url);
            })
            .catch(error => console.error('Error fetching the video:', error));
    }, []);

    return (
        <div>
            <video controls>
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default VideoPlayer;
