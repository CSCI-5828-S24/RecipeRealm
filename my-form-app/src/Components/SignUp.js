import React, { useState } from 'react';
import '../Styles/SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign-up logic here
  };

  return (
    <div class="wrapper">
    <h2>Registration</h2>
    <form onSubmit={handleSubmit}>
      <div class="input-box">
        <input type="text" placeholder="Enter your name" required/>
      </div>
      <div class="input-box">
        <input type="text" placeholder="Enter your email" required/>
      </div>
      <div class="input-box">
        <input type="password" placeholder="Create password" required/>
      </div>
      <div class="input-box">
        <input type="password" placeholder="Confirm password" required/>
      </div>
      <div class="input-box button">
        <input type="Submit" value="Register Now"/>
      </div>
    </form>
  </div>
  );
};

export default SignUp;
