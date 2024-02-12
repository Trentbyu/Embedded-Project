import React, { useState, useEffect } from 'react';
import ipAddress from '../index';

function GetPlayback({ argument, espIp }) {
    const [mp4, setMp4] = useState('');

    useEffect(() => {
        fetch(`http://${ipAddress}:5000/mp4?argument=${argument}&ip_address=${espIp}`)
            .then(response => {
                // Assuming the response is a blob
                return response.blob();
            })
            .then(blob => {
                // Convert the blob into a URL
                const mp4Url = URL.createObjectURL(blob);
                setMp4(mp4Url);
            })
            .catch(error => {
                console.error('Error fetching MP4:', error);
            });
    }, [argument, espIp]);

    return (
        <div>
            {mp4 && (
                <video controls>
                    <source src={mp4} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
}

export default GetPlayback;
