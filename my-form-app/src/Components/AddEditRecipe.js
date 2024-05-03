import React, { useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import '../Styles/AddRecipe.css'
import { ThreeDots } from 'react-loader-spinner';

const AddEditRecipe = () => {

    const location = useLocation();
    const [title, settitle] = useState(location.state ? location.state.recipeData.title : '');
    const [description, setDescription] = useState(location.state ? location.state.recipeData.description : '');
    const [ingredients, setIngredients] = useState(location.state ? location.state.recipeData.ingredients : '');
    const [steps, setSteps] = useState(location.state ? location.state.recipeData.steps : '');
    const [message, setMessage] = useState('');
    const serverURL = process.env.REACT_APP_SERVER_URL;
    const [image, setImage] = useState(null);
    const navigate =  useNavigate();
    const recipe_id = location.state ? location.state.recipeData._id : null
    const imageURL = location.state ? location.state.recipeData.image.filePath: null
    const [loading, setLoading] = useState(true);
    // const [recipe,setRecipe] = useState(null)
    console.log(`${serverURL}/api/recipe/${recipe_id}/editrecipe`)

    const handleBack = () =>{
        if(location.state)
            navigate(`/recipe/${location.state.recipeData._id}`, {state: { recipeData: location.state.recipeData }});
        else
            navigate('/home')
    }

    const handleSubmit = async() => {
        if(!title || !description || !ingredients || !steps){
          setMessage("Please enter all fields")
          return
        }
        const formData = new FormData();
        formData.set('title',title);
        formData.set('description',description);
        formData.set('ingredients',ingredients);
        formData.set('steps',steps);
        //formData.append('image', image ? image:fetch(`${serverURL}/images/${location.state.recipeData.image.filePath}`));
            setLoading(true);
        //    let response
            if(!location.state){
              formData.append('image',image);
              formData.set('author_name',sessionStorage.getItem('user_name'));
              formData.set('author_email',sessionStorage.getItem('user_email'));
                axios.post(`${serverURL}/api/user/addrecipe`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
                }).then(response => {
                  if(response.status===201){
                    navigate(`/recipe/${response.data._id}`, { state: { recipeData: response.data } });
                  } 
                }).catch(error =>{
                  console.error(error);
                }).finally( () => {
                  setLoading(false);
                });
            }
            else{
              axios.put(`${serverURL}/api/recipes/${recipe_id}`, {
                title,
                description,
                ingredients,
                steps,
              })
              .then(response => {
                if(response.status===201){
                  navigate(`/recipe/${response.data._id}`, { state: { recipeData: response.data } });
                }
              })
              .catch(error =>{
                console.error(error);
              }).finally( () => {
                setLoading(false);
              });
            };
            handleBack();
    }

      if (loading) {
        <div className="loading-spinner">
          <ThreeDots className="spinner" color="#333" height={30} width={30} />
        </div>
      }

    return (
        <div className = 'form-container'>
            <form >
            <h2>Add Your Own Recipe</h2>
            <label>Title:</label>
            <textarea value={title} onChange={(e) => settitle(e.target.value)} required></textarea>
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            <label>Image URL:</label>
            {imageURL && <img src={`${serverURL}/images/${imageURL}`} alt={title} />}
            {!location.state && <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>}
            <label>Ingredients:</label>
            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} required></textarea>
            <label>Steps:</label>
            <textarea value={steps} onChange={(e) => setSteps(e.target.value)} required></textarea>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleBack}>Back</button>
            </form>
            {message && <p style={{ whiteSpace: 'pre-wrap', marginBottom: '0', color:'red', fontWeight: 'bold' }} >{message}</p>}
            </div>
  );
}

export default AddEditRecipe;