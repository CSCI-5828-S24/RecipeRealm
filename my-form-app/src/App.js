import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Homescreen from './Components/Homescreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />
        <Route path="/home" element={<Homescreen/>} />
      </Routes>
    </Router>
  );
}

export default App;