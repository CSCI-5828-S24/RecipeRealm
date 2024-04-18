import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import '../Styles/LandingPage.css';

const LandingPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="landing-page">
      <div className="left-half">
        {/* Image and Tagline */}
        <h2 className = 'tagline'>Welcome to the Recipe Realm</h2>
      </div>
      <div className="right-half">
        {/* Conditional rendering for Sign In or Sign Up form */}
        {showSignUp ? <SignUp /> : <SignIn />}
        {/* Switch between Sign In and Sign Up forms */}
        <p>{showSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
          <span className="toggle-link" onClick={() => setShowSignUp(!showSignUp)}>
            {showSignUp ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
