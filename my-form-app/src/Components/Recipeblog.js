import '../Styles/Recipeblog.css';
import React, { useState , useEffect} from 'react';
import { useLocation , Link, useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Component for displaying the recipe
const Recipeblog = () => {

  const isValuePresent = (obj, targetValue) => {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (item === targetValue) {
          return true;
        }
        if (typeof item === 'object' && isValuePresent(item, targetValue)) {
          return true;
        }
      }
      return false;
    }
    return false;
  }
  const { id } = useParams();
  const location = useLocation();
  const serverURL = process.env.REACT_APP_SERVER_URL;
  const [recipe, setRecipe] = useState(location.state ? location.state.recipeData : null)
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comment,setComment] = useState('');
  const [saved, setSaved] = useState(false);
  const [isUSerAuthor, setIsUserAuthor] = useState(false);
  const navigate =  useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipe) return; 
      try {
        setLoading(true);
        const response = await axios.get(`${serverURL}/api/recipes/${id}`);
        setRecipe(response.data);
        setLikes(response.data.likedby.length);
        setLiked(isValuePresent(response.data.likedby,sessionStorage.getItem('user_email')))
        setComments(response.data.comments);
        const user = await axios.get(`${serverURL}/api/user/${sessionStorage.getItem('user_email')}`);
        setSaved(isValuePresent(user.data.savedRecipies,id));
        setIsUserAuthor(sessionStorage.getItem('user_email')===response.data.author.email)
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
      finally{
        setLoading(false);
      }
    };

    const fetchData = async () => {
      if (location.state && location.state.recipeData) {
        await fetchRecipe();
      }
    }
    fetchData();
  }, []);
  

  useEffect(()=>{handleCommentSubmit();},[comments])

  const handleCommentSubmit = () => {
    if (comment.trim() !== '') {
        setLoading(true)
        axios.put(`${serverURL}/api/recipes/${recipe._id}/postcomment`, { comment: comment, commentator: sessionStorage.getItem('user_name') })
        .then(response => {
          if (response.status!=201) {
            toast.error('Failed posting comment');
          }
          setComment('')
          setComments(response.data.comments);
        })
        .catch(error => {
          console.error('Error updating comment:', error);
        })
        .finally(() => {
          setLoading(false)
        });
  }
};

  const handleLikes = async() => {
      if(!liked){
        setLikes(likes + 1);
      }
      else{
        setLikes(likes - 1);
      }
      try {
        setLoading(true)
        console.log(recipe)
        const response = await axios.put(`${serverURL}/api/recipes/${id}/like`, { user_email: sessionStorage.getItem('user_email'), liked: !liked });
        if (response.status!=201) {
          throw new Error('Failed to update like count');
        }
        setLiked(!liked)
      } catch (error) {
        console.error('Error updating like count:', error);
      }
      finally{
        setLoading(false)
      }
  }

  const handleDelete = async() =>{
    if(sessionStorage.getItem('user_email')!==recipe.author.email){
      console.log('Cannot delete post')
      return
    }
    try {
      setLoading(true)
      console.log(recipe)
      const response = await axios.delete(`${serverURL}/api/recipes/${id}/delete`);
      if (response.status!=200) {
        toast.error('Error deleting the post')
        throw new Error('Failed to delete post');
      }
      else{
        toast.success('Deleted the post')
        navigate('/home')
      }
    } catch (error) {
      console.error('Error updating like count:', error);
    }
    finally{
      setLoading(false)
    }
  }

  const handleEdit = async() =>{
    navigate(`/addeditrecipe`, { state: { recipeData: recipe } });
  };

  const handleSaveRecipe = async() => {
    setSaved(!saved);
    try{
      setLoading(true)
      const response = await axios.put(`${serverURL}/api/user/saverecipe/${id}`, { user_email: sessionStorage.getItem('user_email') , saved: !saved});
      if (response.status!=201) {
        throw new Error('Failed posting comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
    finally{
      setLoading(false)
    }
  };

  if (loading) {
    <div className="loading-spinner">
      <ThreeDots className="spinner" color="#f0f" height={30} width={30} />
    </div>
  }

  return (
          <div className="recipe-container">
            <div className="recipe">
            <Link to="/home" className="back-btn">Back to Home</Link> {/* Link to the home page */}
              <h1>{recipe.title}</h1>
              <img src={`${serverURL}/images/${recipe.image.filePath}`} alt={recipe.title} />
              <p className="author">Author: {recipe.author.name}</p>
              <div className='button-container'>
              <button className={liked ? 'like-btn-liked': 'like-btn-unliked'} onClick={handleLikes}>Like</button>
              <button className={saved ? 'save-btn-saved' : 'like-btn-unliked'} onClick={handleSaveRecipe}>
                {saved ? 'Unsave Recipe' : 'Save Recipe'}
              </button>
              {isUSerAuthor && <button className='edit-button' visible={isUSerAuthor} onClick={handleEdit}>Edit Recipe</button>}
              {isUSerAuthor && <button className='delete-button' visible={isUSerAuthor} onClick={handleDelete}>Delete Recipe</button>}
              </div>
              <p className="likes">Likes: {likes}</p> 
              <div className="ingredients">
              <h2>Ingredients:</h2>
              <p>{recipe.ingredients}</p>
              </div>
              <div className="Steps">
              <h2>Instructions:</h2>
              <p>{recipe.steps}</p>
              </div>
              <div className="comment-section">
                <textarea
                  className="comment-input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comment here..."
                ></textarea>
                <button className="comment-submit-btn" onClick={handleCommentSubmit}>Post Comment</button>
              </div>
              <h2>Comments:</h2>
              <div className="comments">
              {comments && Object.keys(comments).map((key) => (
                  <div key = {key} className="comment">
                    <p>{comments[key].comment}</p>
                    <span className="comment-author">- {comments[key].commentator}</span>
                  </div>
                ))}
              </div>
            </div>
            <ToastContainer />
          </div>
  );
}

export default Recipeblog;