import React from 'react';
import '../Styles/Card.css'
import { useNavigate } from 'react-router-dom';

const Card = ({key,recipe}) => {
  
  const serverURL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe._id}`, { state: { recipeData: recipe } });
  };
  return (
    <div className="card" onClick={handleCardClick}>
      <div className="card-image">
        <img src = {`${serverURL}/images/${recipe.image.filePath}`} alt={recipe.title} />
      </div>
      <div className="card-details">  
        <h3>{recipe.title}</h3>
        <p className="description">{recipe.description}</p>
        <p className="ingredients">Ingredients: {recipe.ingredients}</p>
        <p className="author">By {recipe.author.name}</p>
        <p className="likes">Likes {recipe.likes}</p>
      </div>
    </div>
  );
};

export default Card;