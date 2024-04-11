// Modal.js
import React from 'react';
import '../Styles/Modal.css'; // Import CSS for styling

const Modal = ({ isOpen, onClose, children }) => {
  const handleClose = () => {
    onClose(); // Call the onClose function provided by the parent component
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={handleClose}>X</span>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
