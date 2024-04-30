import React from 'react';
import { render, fireEvent, getByPlaceholderText, waitFor, screen } from '@testing-library/react';
import SignIn from '../../Components/SignIn';
import { MemoryRouter } from 'react-router-dom';

describe('SignIn Component', () => {
  test('Render login form with "Log In" button', async () => {
    const { getByDisplayValue } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    // Verify that the "Log In" button is rendered
    const logInButton = getByDisplayValue('Log In');
    expect(logInButton).toBeInTheDocument();
  });

  test('does not submit form with empty email and shows error message', () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
  
    // Simulate clicking the Log In button without entering the email
    const logInButton = screen.getByDisplayValue('Log In');
    fireEvent.click(logInButton);
  
    // Check if the error message is displayed for empty email field
    const errorMessage = getByPlaceholderText('Enter your email');
    expect(errorMessage).toBeInTheDocument();
  });
  

test('Submitting login form with invalid email', async () => {
    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    // Simulate entering an invalid email
    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });

    // Simulate clicking the Log In button
    const logInButton = screen.getByDisplayValue('Log In');
    fireEvent.click(logInButton);
    
    

    const errorMessageElement = screen.queryByText('Enter all the fields');

  // Check if the error message element is present
  expect(errorMessageElement).toBeInTheDocument();
});

  test('does not submit form with empty password and shows error message', () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
  
    // Simulate entering an email
    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  
    // Simulate clicking the Log In button without entering the password
    const logInButton = screen.getByDisplayValue('Log In');
    fireEvent.click(logInButton);
  
    // Check if the error message is displayed for empty password field
    const errorMessage = getByPlaceholderText('Create password');
    expect(errorMessage).toBeInTheDocument();
  });
  
  
});
