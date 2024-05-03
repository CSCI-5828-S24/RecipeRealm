import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Homescreen from './Components/Homescreen';
import Recipeblog from './Components/Recipeblog';
import AddEditRecipe from './Components/AddEditRecipe';

function App() {
  /* unused function
  function DynamicAddEditRouting() {
    const params = new URLSearchParams(window.location.search);
    const hasQueryParams = params.has('');
    console.log(params)
    return hasQueryParams ? <Homescreen /> : null;
  }*/

  function DynamicAddEditRouting() {
    const params = new URLSearchParams(window.location.search);
    const hasQueryParams = params.has('');
    console.log(params)
    return hasQueryParams ? <Homescreen /> : null;
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />
        <Route exact path="/home" element={<Homescreen/>} />
        <Route exact path="/recipe/:id" element={<Recipeblog/>} />
        <Route exact path="/logout" element={<LandingPage/>} />
        <Route path="/addeditrecipe" element={<AddEditRecipe />} />
      </Routes>
    </Router> 
  );
}

export default App;