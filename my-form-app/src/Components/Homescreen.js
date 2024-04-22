// src/components/HomePage.js
import React, { useEffect } from 'react';
import '../Styles/Homescreen.css'
import Card from './Card'
import RecipeModal from './RecipeModal'
import AddRecipe from './AddRecipe';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MenuBar from './MenuBar'

const Homescreen = () => {
  const [filter, setFilter] = useState('');
  const [recipeList,setRecipeList] = useState(null);
  const [loading, setLoading] = useState(false);
  const serverURL = process.env.REACT_APP_SERVER_URL;
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const openRecipeModal = () => {
    setIsRecipeModalOpen(true);
  };

  const closeRecipeModal = () => {
    setIsRecipeModalOpen(false);
  };

  const handleAddRecipe = (recipeData) => {
    // Handle submission of new recipe data
    console.log('New recipe data:', recipeData);
    closeRecipeModal();
  };

  const handleMenuClick = async (option) => {
    setAnchorEl(null)
    try {
      setLoading(true);
      let response;
      if (option === 'My Recipes') {
        response = await axios.get(`${serverURL}/api/user/myrecipies/${sessionStorage.getItem('user_email')}`);
        setRecipeList(response.data)
      } else if (option === 'My Saved Posts') {
        response = await axios.get(`${serverURL}/api/user/mysavedrecipies/${sessionStorage.getItem('user_email')}`);
        setRecipeList(response.data)
      } else if (option === 'All Recipies') {
        setFilter('all')
      }else if (option === 'Logout') {
        response = await axios.post(`${serverURL}/api/user/logout`);
        if(response.status==200){
          sessionStorage.removeItem('user_email')
          sessionStorage.removeItem('user_name')
          navigate('/logout')
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverURL}/api/query?key=${filter}`);
        setRecipeList(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  if(loading){
    return
  }

  return (
    <div className="home-page">
      <div className="header">
        <div className="header-content">
          <input type="text" placeholder="Search..." className="search-bar" onChange={(e) => setFilter(e.target.value)}/>
          {loading && <ThreeDots color="#00BFFF" height={24} width={24} />}
          <button className="homescreenbutton" onClick={openRecipeModal}>Add Your Own Recipe</button>
          <RecipeModal isOpen={isRecipeModalOpen} onClose={closeRecipeModal}>
            <AddRecipe onSubmit={handleAddRecipe} />
          </RecipeModal>
          <ToastContainer />
        </div>
        <button className="menu-button" onClick={(e) => setAnchorEl(e.currentTarget)}>Menu</button>
        <MenuBar anchorEl= {anchorEl} isOpen={Boolean(anchorEl)} handleClose={() => setAnchorEl(null)} handleMenuClick={handleMenuClick}/>
      </div>
      <div className="card-grid">
        {recipeList && Object.keys(recipeList).map((key) => (
          <Card recipe={recipeList[key]} />
        ))}
      </div>
    </div>
  );
};

export default Homescreen;
