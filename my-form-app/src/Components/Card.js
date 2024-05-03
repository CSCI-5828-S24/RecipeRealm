import React from 'react';
import '../Styles/Card.css'
import { useNavigate } from 'react-router-dom';

const Card = ({key,recipe}) => {
  
  const serverURL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/recipe/${recipe._id? recipe.id:recipe.title}`, { state: { recipeData: recipe } });
  };
  return (
    <div className="card" onClick={handleCardClick}>
      <div className="card-image">
        <img src = {recipe.image.filePath ? `${serverURL}/images/${recipe.image.filePath}` : recipe.image} alt={recipe.title} />
      </div>
      <div className="card-details">  
        <h3>{recipe.title}</h3>
        {recipe.description && <p className="description">{recipe.description}</p>}
        {recipe.health_labels && recipe.health_labels.length>0 &&
          <div>
            <h4>Health Labels:</h4>
          <div className="health-labels">
          {recipe.health_labels.map((label, index) => (
              <span key={index} className="health-label">{label}</span>
          ))}
          </div>
          </div>
        }
        {recipe.cautions && recipe.cautions.length>0 && 
          <div>
            <h4>Caution Labels:</h4>
            <div className="caution-labels">
          {recipe.cautions.map((label, index) => (
              <span key={index} className="caution-label">{label}</span>
          ))}
          </div>
          </div>
        }
        {recipe.dietLabels && recipe.dietLabels.length>0 &&
          <div>
            <h4>Diet Labels:</h4>
            <div className="diet-labels">
          {recipe.dietLabels.map((label, index) => (
              <span key={index} className="diet-label">{label}</span>
          ))}
          </div>
          </div>
        }
        {recipe.ingredients && <p className="ingredients">Ingredients: {recipe.ingredients}</p>}
        
        {recipe.author && <p className="author">By {recipe.author.name}</p>}
        {recipe.likedby && <p className="likes">Likes {recipe.likedby.length}</p>}

        {recipe.calories && <h4>Calories: {recipe.calories}</h4>}
      </div>
    </div>
  );
};

export default Card;