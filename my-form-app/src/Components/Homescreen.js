// src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Homescreen.css'
import Card from './Card'
import RecipeModal from './RecipeModal'
import AddRecipe from './AddRecipe';
import { useState } from 'react';

const Homescreen = () => {
  const navigate = useNavigate();

  // Function to handle button clicks
  const handleButtonClick = (route) => {
    navigate(route);
  };

  const cards = [
    { id: 1, title: 'Chicken Biriyani', author: 'Manojdeep', likes: 10, ingredients:'Chicken,Aromatics,Spices,Onions,Ghee,Chilli peppers, Rice', description:'The Hyderabadi chicken dum biryani recipe uses fresh spices, flavourful herbs, and other ingredients, which add a royal touch to the dish. There is also the use of the best variety of rice for the dish.', imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01.jpg'},
    { id: 2, title: 'Chicken Biriyani', author: 'Manojdeep', likes: 10, ingredients:'Chicken,Aromatics,Spices,Onions,Ghee,Chilli peppers, Rice', description:'The Hyderabadi chicken dum biryani recipe uses fresh spices, flavourful herbs, and other ingredients, which add a royal touch to the dish. There is also the use of the best variety of rice for the dish.', imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01.jpg'},
    { id: 3, title: 'Chicken Biriyani', author: 'Manojdeep', likes: 10, ingredients:'Chicken,Aromatics,Spices,Onions,Ghee,Chilli peppers, Rice', description:'The Hyderabadi chicken dum biryani recipe uses fresh spices, flavourful herbs, and other ingredients, which add a royal touch to the dish. There is also the use of the best variety of rice for the dish.', imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01.jpg'},
    { id: 4, title: 'Chicken Biriyani', author: 'Manojdeep', likes: 10, ingredients:'Chicken,Aromatics,Spices,Onions,Ghee,Chilli peppers, Rice', description:'The Hyderabadi chicken dum biryani recipe uses fresh spices, flavourful herbs, and other ingredients, which add a royal touch to the dish. There is also the use of the best variety of rice for the dish.', imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01.jpg'},
    { id: 5, title: 'Chicken Biriyani', author: 'Manojdeep', likes: 10, ingredients:'Chicken,Aromatics,Spices,Onions,Ghee,Chilli peppers, Rice', description:'The Hyderabadi chicken dum biryani recipe uses fresh spices, flavourful herbs, and other ingredients, which add a royal touch to the dish. There is also the use of the best variety of rice for the dish.', imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01.jpg'},
    { id: 6, title: 'Chicken Biriyani', author: 'Manojdeep', likes: 10, ingredients:'Chicken,Aromatics,Spices,Onions,Ghee,Chilli peppers, Rice', description:'The Hyderabadi chicken dum biryani recipe uses fresh spices, flavourful herbs, and other ingredients, which add a royal touch to the dish. There is also the use of the best variety of rice for the dish.', imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01.jpg'}
    // Add more cards as needed
  ];

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


  return (
    <div className="home-page">
      <div className="header">
        <div className="header-content">
          <input type="text" placeholder="Search..." className="search-bar" />
          <button className="homescreenbutton">Search</button>
          <button className="homescreenbutton" onClick={openRecipeModal}>Add Your Own Recipe</button>
          <RecipeModal isOpen={isRecipeModalOpen} onClose={closeRecipeModal}>
            <AddRecipe onSubmit={handleAddRecipe} />
          </RecipeModal>
        </div>
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            author={card.author}
            likes={card.likes}
            imageUrl={card.imageUrl}
            ingredients={card.ingredients}
            description={card.description}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Homescreen;
