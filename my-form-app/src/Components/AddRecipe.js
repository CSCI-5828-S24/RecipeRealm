// AddRecipeForm.js
import React, { useState } from 'react';
import '../Styles/AddRecipe.css'

const AddRecipeForm = ({ onSubmit }) => {
  const [title, settitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title,description, imageUrl, ingredients });
  };

  return (
    <div class = 'form-container'>
    <form onSubmit={handleSubmit}>
      <h2>Add Your Own Recipe</h2>
      <label>Title:</label>
      <textarea value={title} onChange={(e) => settitle(e.target.value)}></textarea>
      <label>Description:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      <label>Image URL:</label>
      <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <label>Ingredients:</label>
      <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)}></textarea>
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default AddRecipeForm;
