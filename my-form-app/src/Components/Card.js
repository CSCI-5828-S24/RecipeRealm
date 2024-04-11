import React from 'react';
import '../Styles/Card.css'
import CardModal from './CardModal';
import { useState } from 'react';

const Card = ({ title, author, likes,ingredients,description,imageUrl}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
    <div className="card" onClick={openModal}>
      <div className="card-image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="card-details">
        <h3>{title}</h3>
        <p className="description">By {description}</p>
        <p className="ingredients">Likes: {ingredients}</p>
        <p className="author">By {author}</p>
        <p className="likes">Likes {likes}</p>
      </div>
    </div>
    <CardModal isOpen={isModalOpen} onClose={closeModal} content={{ title, author, likes,ingredients,description,imageUrl }} />
    </>
  );
};

export default Card;