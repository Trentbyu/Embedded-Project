import React, { useState, useEffect } from 'react';
import initialData from './HomePage.json';

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
    const savedComponents = JSON.parse(localStorage.getItem('components'));
    if (savedComponents) {
      setComponents(savedComponents);
    } else {
      setComponents(initialData.components);
    }
  }, []);

  const addData = () => {
    const updatedComponents = [...components, newComponentData];
    setComponents(updatedComponents);
    localStorage.setItem('components', JSON.stringify(updatedComponents));
    setNewComponentData({
      type: "",
      props: {
        imageSourceLink: "",
        containerId: "",
        ESPNAME: "",
        Device: ""
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComponentData(prevData => ({
      ...prevData,
      props: {
        ...prevData.props,
        [name]: value
      }
    }));
  };

  return (
    <div className="container mx-auto p-4">
      {components.map((component, index) => (
        <div key={index} className="bg-gray-200 p-4 rounded-md mb-4">
          <p className="font-semibold">Type: {component.type}</p>
          <p className="font-semibold">IP: {component.props.imageSourceLink}</p>
          {/* <p className="font-semibold">Type: {component.props.containerId}</p> */}
          <p className="font-semibold">NAME: {component.props.ESPNAME}</p>



        </div>
      ))}
      
    </div>
  );
};

export default SettingsPage;
