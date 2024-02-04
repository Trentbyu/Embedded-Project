import React, { useState } from 'react';
import ReactPlayer from 'react-player';

function VideoPlayer() {
    const [videos, setVideos] = useState([]);

    const handleVideoUpload = (event) => {
        const files = Array.from(event.target.files);
        const videosArray = files.map(file => URL.createObjectURL(file));
        setVideos(videosArray);
    };

    return (
        <div>
            <input type="file" onChange={handleVideoUpload} multiple />
            {videos.map((videoUrl, index) => (
                <div key={index}>
                    <ReactPlayer url={videoUrl} width="100%" height="100%" controls={true} />
                </div>
            ))}
        </div>
    );
}

export default VideoPlayer;
