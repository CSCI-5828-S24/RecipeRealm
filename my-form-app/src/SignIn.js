// SignInForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/SignUp.css';
import { ThreeDots } from 'react-loader-spinner';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const serverURL = process.env.REACT_APP_SERVER_URL;

  const handleSignin = async() => {
    // if (!email.trim()) {
    //   setMessage('Enter your email');
    //   return;
    // } else if (!isValidEmail(email)) {
    //   setMessage('Please enter a valid email');
    //   return;
    // } else if (!password.trim()) {
    //   setMessage('Enter your password');
    //   return;
    // }
    if (!email.trim() || !password.trim()) {
 
      setMessage('Enter all the fields');
      return;
    } else if (!isValidEmail(email)) {
        
      setMessage('Please enter a valid email');
      return;
    }
    else{
    try {
      setLoading(true);
      console.log('Posting')
      const response = await fetch(`${serverURL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password}),
      });
      const data = await response.json();
      setMessage(data.message);
      if(response.status === 200){
        sessionStorage.setItem('user_name', data.user_name);
        sessionStorage.setItem('user_email', data.user_email);
        console.log(sessionStorage.getItem('user_save_recipies'))
        navigate('/home')
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error Signing user');
    }
    finally{
      setLoading(false);
    }
  }
  };

  const isValidEmail = (email) => {
    // Simple email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="wrapper">
    <h2>Login to your account</h2>
    <form>
      <div className="input-box">
        <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required/>
      </div>
      <div className="input-box">
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Create password" required/>
      </div>
      <div className="input-box button">
      {loading ? (
             <ThreeDots color="#00BFFF" height={24} width={24} />
          ) : (
        <input onClick={handleSignin} defaultValue="Log In"/>
        )}
      </div>
      {message && <p data-testid="error-message" style={{ whiteSpace: 'pre-wrap', marginBottom: '0', color:'red', fontWeight: 'bold' }} >{message}</p>}
      </form>
  </div>
  );
};

export default SignIn;
