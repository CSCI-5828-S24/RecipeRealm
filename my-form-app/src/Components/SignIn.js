// SignInForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/SignUp.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const naviagte = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    naviagte('/home')
    // Handle sign-in logic here
  };

  return (
    <div className="wrapper">
    <h2>Login to your account</h2>
    <form onSubmit={handleSubmit}>
      <div className="input-box">
        <input type="text" placeholder="Enter your email" required/>
      </div>
      <div className="input-box">
        <input type="password" placeholder="Create password" required/>
      </div>
      <div className="input-box button">
        <input type="Submit" defaultValue="Log In"/>
      </div>
      {error && <p style={{ whiteSpace: 'pre-wrap', marginBottom: '0', color:'red', fontWeight: 'bold' }} >{error}</p>}
    </form>
  </div>
  );
};

export default SignIn;
