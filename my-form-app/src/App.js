import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Homescreen from './Components/Homescreen';
import Recipeblog from './Components/Recipeblog';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />
        <Route exact path="/home" element={<Homescreen/>} />
        <Route exact path="/recipe/:id" element={<Recipeblog/>} />
      </Routes>
    </Router>
  );
}

export default App;