import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ElementForm({ onElementCreated }) {
    const [elements, setElements] = useState([]);
    const [elementData, setElementData] = useState({ element_type: '', ip_address: '', name: '', device_type: '' });

    useEffect(() => {
        fetchElements();
    }, []);

    const fetchElements = () => {
        axios.get('http://127.0.0.1:8000/api/elements/')
            .then(response => {
                setElements(response.data);
            })
            .catch(error => {
                console.error('Error fetching elements:', error);
            });
    };

    const handleChange = (e) => {
        setElementData({ ...elementData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/elements/create/', elementData)
            .then(response => {
                onElementCreated(response.data);
                setElementData({ element_type: '', ip_address: '', name: '', device_type: '' });
                fetchElements(); // Reload elements after successful creation
            })
            .catch(error => {
                console.error('Error creating element:', error);
            });
    };

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/elements/${id}/`)
            .then(response => {
                setElements(prevElements => prevElements.filter(element => element.id !== id)); // Remove the deleted element from the local state
            })
            .catch(error => {
                console.error('Error deleting element:', error);
            });
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl mb-4">Add ESP</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="element_type">Element Type:</label>
                    <select className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="element_type" value={elementData.element_type} onChange={handleChange}>
                        <option value="">Select Element Type</option>
                        <option value="ImageViewer">Video</option>
                        <option value="TemperatureViewer">Temperature</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="device_type">Device Type:</label>
                    <select className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="device_type" value={elementData.device_type} onChange={handleChange}>
                        <option value="">Select Device Type</option>
                        <option value="ESP32">ESP32</option>
                        <option value="ESP8266">ESP8266</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ip_address">IP Address:</label>
                    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="ip_address" value={elementData.ip_address} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name:</label>
                    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" value={elementData.name} onChange={handleChange} />
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Add Element</button>
            </form>
            <h2 className="text-2xl mt-8 mb-4">Element Details</h2>
            <ul>
                {elements.map(element => (
                    <li key={element.id} className="mb-4 p-4 bg-white shadow-md rounded-lg">
                        <div className="mb-2">
                            <span className="font-bold">Element Type:</span> {element.element_type}
                        </div>
                        <div>
                            <span className="font-bold">IP Address:</span> {element.ip_address}
                        </div>
                        <div>
                            <span className="font-bold">Name:</span> {element.name}
                        </div>
                        <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => handleDelete(element.id)}>Delete Element</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ElementForm;
