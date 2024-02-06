import React, { useState, useEffect } from 'react';

const SettingsPage = ({ ipAddress }) => {
  const [components, setComponents] = useState([]);
  const [newComponentData, setNewComponentData] = useState({
    type: "",
    props: {
      imageSourceLink: "",
      ESPNAME: "",
      Device: ""
    }
  });

  useEffect(() => {
    fetch(`http://${ipAddress}:5000/api/components`)
      .then(response => response.json())
      .then(data => setComponents(data))
      .catch(error => console.error('Error fetching components:', error));
  }, []);

  const addData = (imageSourceLink) => {
    // Fetch request to add component
    fetch(`http://${ipAddress}:5000/api/components`, {
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
          imageSourceLink: "", // Resetting image source link
          ESPNAME: "",
          Device: ""
        }
      });
  
      // Fetch request to set server IP address
      fetch(`http://${imageSourceLink}/serverIP?ip=${ipAddress}`, {
        method: 'GET',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to set server IP address');
        }
        return response.text();
      })
      .then(responseText => {
        console.log(responseText); // Log success message
      })
      .catch(error => console.error('Error setting server IP address:', error));
    })
    .catch(error => console.error('Error adding component:', error));
  };

  const deleteComponent = (index) => {
    fetch(`http://${ipAddress}:5000/api/components/${index}`, {
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

  const updateComponentOrder = (updatedComponents) => {
    const newOrder = {
      components: updatedComponents.map(component => component)
    };
  
    fetch(`http://${ipAddress}:5000/api/components/order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    })
    .then(response => {
      if (response.ok) {
        console.log('Component order updated successfully');
        setComponents(updatedComponents); // Update the state with the new order
      } else {
        console.error('Failed to update component order:', response.statusText);
      }
    })
    .catch(error => console.error('Error updating component order:', error));
  };

  const moveComponentUp = (index) => {
    if (index > 0) {
      const updatedComponents = [...components];
      const temp = updatedComponents[index];
      updatedComponents[index] = updatedComponents[index - 1];
      updatedComponents[index - 1] = temp;
      updateComponentOrder(updatedComponents); // Pass updated components directly
    }
  };

  const moveComponentDown = (index) => {
    if (index < components.length - 1) {
      const updatedComponents = [...components];
      const temp = updatedComponents[index];
      updatedComponents[index] = updatedComponents[index + 1];
      updatedComponents[index + 1] = temp;
      updateComponentOrder(updatedComponents); // Pass updated components directly
    }
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
          <option value="ImageViewer">Camera</option>
          <option value="TemperatureViewer">Temperature</option>
        </select>
        <input 
          type="text" 
          name="imageSourceLink" 
          value={newComponentData.props.imageSourceLink} 
          onChange={handleInputChange} 
          placeholder="Ip Address"
          className="block w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
        />
        <input 
          type="text" 
          name="ESPNAME" 
          value={newComponentData.props.ESPNAME} 
          onChange={handleInputChange} 
          placeholder="ESP NAME"
          className="block w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
        />
        <input 
          type="text" 
          name="Device" 
          value={newComponentData.props.Device} 
          onChange={handleInputChange} 
          placeholder="Device Type"
          className="block w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
        />
        <button 
          onClick={() => addData(newComponentData.props.imageSourceLink)} 
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
            <button 
              onClick={() => moveComponentUp(index)} 
              className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
            >
              Move Up
            </button>
            <button 
              onClick={() => moveComponentDown(index)} 
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Move Down
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
