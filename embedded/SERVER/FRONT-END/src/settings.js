import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [components, setComponents] = useState([]);
  const [newComponentData, setNewComponentData] = useState({
    type: "",
    props: {
      imageSourceLink: "",
      containerId: "",
      ESPNAME: "",
      Device: ""
    }
  });

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/components')
      .then(response => response.json())
      .then(data => setComponents(data))
      .catch(error => console.error('Error fetching components:', error));
  }, []);

  const addData = () => {
    fetch('http://127.0.0.1:5000/api/components', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComponentData),
    })
    .then(response => response.json())
    .then(data => {
      setComponents([...components, data]);
      setNewComponentData({
        type: "", // Resetting type after successful addition
        props: {
          imageSourceLink: "",
          containerId: "",
          ESPNAME: "",
          Device: ""
        }
      });
    })
    .catch(error => console.error('Error adding component:', error));
  };

  const deleteComponent = (index) => {
    fetch(`http://127.0.0.1:5000/api/components/${index}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setComponents(components.filter((_, i) => i !== index));
      } else {
        console.error('Failed to delete component:', response.statusText);
      }
    })
    .catch(error => console.error('Error deleting component:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setNewComponentData(prevData => ({
        ...prevData,
        [name]: value
      }));
    } else {
      setNewComponentData(prevData => ({
        ...prevData,
        props: {
          ...prevData.props,
          [name]: value
        }
      }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Add New Component</h2>
        <label className="block mb-2">Type:</label>
        <select 
          className="block w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
          name="type" 
          value={newComponentData.type} 
          onChange={handleInputChange}
        >
          <option value="">Select Type</option>
          <option value="ImageViewer">ImageViewer</option>
          <option value="TemperatureViewer">TemperatureViewer</option>
        </select>
        <input 
          type="text" 
          name="imageSourceLink" 
          value={newComponentData.props.imageSourceLink} 
          onChange={handleInputChange} 
          placeholder="Image Source Link"
          className="block w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
        />
        <input 
          type="text" 
          name="ESPNAME" 
          value={newComponentData.props.ESPNAME} 
          onChange={handleInputChange} 
          placeholder="ESPNAME"
          className="block w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
        />
        <input 
          type="text" 
          name="Device" 
          value={newComponentData.props.Device} 
          onChange={handleInputChange} 
          placeholder="Device"
          className="block w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
        />
        <button 
          onClick={addData} 
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <hr className="my-8" />
      <div>
        <h2 className="text-xl font-bold mb-2">Components</h2>
        {components.map((component, index) => (
          <div key={index} className="bg-gray-200 p-4 rounded-md mb-4">
            <p className="font-semibold">Type: {component.type}</p>
            <p className="font-semibold">IP: {component.props.imageSourceLink}</p>
            <p className="font-semibold">NAME: {component.props.ESPNAME}</p>
            <button 
              onClick={() => deleteComponent(index)} 
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
