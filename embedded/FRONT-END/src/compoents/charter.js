import React, { useState, useEffect } from 'react';

const Grapher = ({apiEndpoint}) => {
    const [plotImage, setPlotImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://192.100.1.100:5000/api/get_float_data?ip_address=${apiEndpoint}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const arrayBuffer = await response.arrayBuffer();
                const base64Image = btoa(
                    new Uint8Array(arrayBuffer).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );
                setPlotImage(`data:image/png;base64,${base64Image}`);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching plot image:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <img src={plotImage} alt="Plot" width={400} />
            )}
        </div>
    );
};

export default Grapher;
