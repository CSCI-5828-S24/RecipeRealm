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

  const handleSignin = async() => {
    if( !password || !email){
      console.error('Error:', 'Enter all the fields');
      setMessage('Enter all the fields');
    }
    else{
    try {
      setLoading(true);
      console.log('Posting')
      const response = await fetch('https://reciperealm-lu8p.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password}),
      });
      const data = await response.json();
      setMessage(data.message);
      if(response.status === 200){
        sessionStorage.setItem('user', data.user);
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
      {message && <p style={{ whiteSpace: 'pre-wrap', marginBottom: '0', color:'red', fontWeight: 'bold' }} >{message}</p>}
      </form>
  </div>
  );
};

export default SignIn;
