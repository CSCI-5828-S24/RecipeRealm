// src/components/HomePage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Homescreen.css'
import Card from './Card'
import RecipeModal from './RecipeModal'
import AddRecipe from './AddRecipe';
import { useState } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Homescreen = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [recipeList,setRecipeList] = useState('');
  const [loading, setLoading] = useState(false);
  const serverURL = process.env.REACT_APP_SERVER_URL;

  // Function to handle card clicks
  const handleCardClick = (id) => {
    console.log(`Clicked on card with id ${id}`);
    // Add your logic for handling card clicks here
  };

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
      </div>
      <div className="card-grid">
        {Object.keys(recipeList).map((key) => (
          <Card
            key={key}
            title={recipeList[key].title}
            author={recipeList[key].author} 
            likes={recipeList[key].likes}
            imageUrl={recipeList[key].image.filePath}
            ingredients={recipeList[key].ingredients}
            description={recipeList[key].description}
            onClick={() => handleCardClick({key})}
          />
        ))}
      </div>
    </div>
  );
};

export default Homescreen;
