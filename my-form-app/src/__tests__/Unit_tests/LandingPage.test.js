import React from 'react';
import { render, fireEvent, waitFor, getByDisplayValue } from '@testing-library/react';
import LandingPage from '../../Components/LandingPage';
import { MemoryRouter } from 'react-router-dom';

describe('LandingPage Component', () => {
  test('renders sign-in form by default', async () => {
    const { getByPlaceholderText, getByText, getByDisplayValue} = render(
        <MemoryRouter> {/* Wrap LandingPage with MemoryRouter */}
          <LandingPage />
        </MemoryRouter>
      );
    expect(getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(getByPlaceholderText('Create password')).toBeInTheDocument();
    const logInButton = getByDisplayValue('Log In');
    expect(logInButton).toBeInTheDocument();
    expect(getByText("Don't have an account?")).toBeInTheDocument();
  });

  test('renders sign-up form when "Sign up" link is clicked', async () => {
    const { getByText, getByPlaceholderText, getByDisplayValue} = render(
        <MemoryRouter> {/* Wrap LandingPage with MemoryRouter */}
          <LandingPage />
        </MemoryRouter>
      );

    fireEvent.click(getByText('Sign up'));

    expect(getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(getByPlaceholderText('Create password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm password')).toBeInTheDocument();
    const registerbutton = getByDisplayValue('Register Now');
    expect(registerbutton).toBeInTheDocument();
    expect(getByText('Already have an account?')).toBeInTheDocument();
  });

  test('switches between sign-in and sign-up forms when "Sign in" link is clicked', () => {
    const { getByText, queryByText } = render(
        <MemoryRouter> {/* Wrap LandingPage with MemoryRouter */}
          <LandingPage />
        </MemoryRouter>
      );

    fireEvent.click(getByText('Sign up'));
    expect(queryByText('Log In')).toBeNull(); // Sign-in form should not be visible
    fireEvent.click(getByText('Sign in'));
    expect(queryByText('Register Now')).toBeNull(); // Sign-up form should not be visible
  });
});
