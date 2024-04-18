import React, { useState } from 'react';
import '../Styles/SignUp.css';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';


const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (confpassword!==password){
      console.error('Error:', 'Password and Confirmned Password Mismatch');
      setMessage('Password and Confirmned Password Mismatch');
    }
    else{
      try {
        setLoading(true);
        console.log('Posting')
        const response = await fetch('http://localhost:3001/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name,email, password, confpassword }),
        });
        const data = await response.json();
        setMessage(data.message);
        if(response.status === 201){
          navigate('/home')
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error registering user');
      }
      finally{
        setLoading(false);
      }
    }
    };

  return (
    <div className="wrapper">
    <form>
    <h2>Registration</h2>
      <div className="input-box">
        <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required/>
      </div>
      <div className="input-box">
        <input type="text"  onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required/>
      </div>
      <div className="input-box">
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Create password" required/>
      </div>
      <div className="input-box">
        <input type="password" onChange={(e) => setConfPassword(e.target.value)} placeholder="Confirm password" required/>
      </div>
      <div className="input-box button">
      {loading ? (
             <ThreeDots color="#00BFFF" height={24} width={24} />
          ) : (
        <input onClick={handleRegister} defaultValue="Register Now"/>
        )}
      </div>
      {message && <p style={{ whiteSpace: 'pre-wrap', marginBottom: '0', color:'red', fontWeight: 'bold' }} >{message}</p>}
      </form>
  </div>
  );
};

export default SignUp;
