import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
const ipAddress = '192.100.1.100'; 
// const ipAddress = '192.168.0.178'; 

export default ipAddress;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


