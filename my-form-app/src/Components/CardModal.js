// Modal.js
import React from 'react';
import '../Styles/Modal.css';

const CardModal = ({ isOpen, onClose, content }) => {

  const handleClose = () => {
    onClose(); // Call the onClose function provided by the parent component
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={handleClose}>X</span>
        <div className="modal-body">
        <div className="left-content">
            <h2>{content.title}</h2>
            <p>Description: {content.description}</p>
            <p>Ingredients: {content.ingredients}</p>
            <p>Author: {content.author}</p>
            <p>Likes: {content.likes}</p>
          </div>
          <div className="right-content">
            <img src={content.imageUrl} alt={content.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
