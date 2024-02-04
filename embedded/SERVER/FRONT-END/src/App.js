// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './compoents/nav';
import Esp32ConfigPage from './Esp32ConfigPage';
import HomePage from './home';


const App = () => {
  return (
    <Router>
      <div className="">
        <Navbar />

        <div className="min-h-screen flex flex-col py-10 bg-gray-500">
          

          {/* Route Configuration */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/config" element={<Esp32ConfigPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
