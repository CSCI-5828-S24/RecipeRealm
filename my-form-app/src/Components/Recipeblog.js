import '../Styles/Recipeblog.css';
import React, { useState } from 'react';
import { useLocation , Link} from 'react-router-dom';
import axios from 'axios';

// Component for displaying the recipe
const Recipeblog = () => {

  const [liked, setLiked] = useState(false);
  const location = useLocation();
  const recipe = location.state ? location.state.recipeData : null;
  const serverURL = process.env.REACT_APP_SERVER_URL;
  const [likes, setLikes] = useState(recipe.likes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(recipe.comments);

  
  const handleLike = () => {
    if(!liked){
    setLikes(likes + 1);
    setLiked(!liked)
    }
    else{
      setLikes(likes - 1);
      setLiked(!liked)
    }

  };

  const handleCommentSubmit = async() => {
    if (comment.trim() !== '') {
      try{
        const response = await axios.put(`${serverURL}/api/recipes/${recipe._id}/postcomment`, { comment: comment, commentator: sessionStorage.getItem('user') });
        if (response.status!=201) {
          throw new Error('Failed posting comment');
        }
        setComment('')
        setComments(response.data.UpdatedComments);
      } catch (error) {
        console.error('Error updating comment:', error);
    }
  }
};

  const handlelikes = async() => {
    if(liked){
      try {
        // Send a PUT request to the server to update the like count in the database
        const response = await axios.put(`${serverURL}/api/recipes/${recipe._id}/like`, { likes: likes });
        if (response.status!=201) {
          throw new Error('Failed to update like count');
        }
      } catch (error) {
        console.error('Error updating like count:', error);
      }
    }
  }

  return (
          <div className="recipe-container">
            <div className="recipe">
            <Link to="/home" onClick = {handlelikes} className="back-btn">Back to Home</Link> {/* Link to the home page */}
              <h1>{recipe.title}</h1>
              <img src={`${serverURL}/images/${recipe.image.filePath}`} alt={recipe.title} />
              <p className="author">Author: {recipe.author}</p>
              <button className={liked ? 'like-btn-liked': 'like-btn-unliked'} onClick={handleLike}>Like</button>
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
              {Object.keys(comments).map((key) => (
                  <div className="comment">
                    <p>{comments[key].comment}</p>
                    <span className="comment-author">- {comments[key].commenter}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
  );
}

export default Recipeblog;