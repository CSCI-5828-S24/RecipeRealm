// SignInForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/SignUp.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const naviagte = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    naviagte('/home')
    // Handle sign-in logic here
  };

  return (
    <div class="wrapper">
    <h2>Login to your account</h2>
    <form onSubmit={handleSubmit}>
      <div class="input-box">
        <input type="text" placeholder="Enter your email" required/>
      </div>
      <div class="input-box">
        <input type="password" placeholder="Create password" required/>
      </div>
      <div class="input-box button">
        <input type="Submit" value="Log In"/>
      </div>
    </form>
  </div>
  );
};

export default SignIn;
