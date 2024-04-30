// SignUp.test.js
import React from 'react';
import { render, fireEvent, waitFor, waitForElement, getByText, getByPlaceholderText } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import SignUp from '../../Components/SignUp';

describe('SignUp Component', () => {
  test('Render signup form with "Register Now" button', async () => {
    const { getByDisplayValue } = render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

    // Verify that the "Register Now" button is rendered
    const registerButton = getByDisplayValue('Register Now');
    expect(registerButton).toBeInTheDocument();
  });

  test('Submitting sign up form with invalid email', () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    // Simulate entering an invalid email
    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });

    // Simulate clicking the Log In button
    const signupButton = document.querySelector('input[value="Register Now"]');
    fireEvent.click(signupButton);

    // Check if the error message is present
    const errorMessage = getByText('Enter all the fields');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Submitting signup form with mismatched passwords', async () => {
    const { getByPlaceholderText, getByText } = render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );
    // Simulate entering form data
    fireEvent.change(getByPlaceholderText('Enter your name'), { target: { value: 'abc' } });
    fireEvent.change(getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Create password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'password456' } });

    // Simulate clicking the "Register Now" button
    const signupButton = document.querySelector('input[value="Register Now"]');
    fireEvent.click(signupButton);

    // Wait for the error message to appear
    const errorMessage = await waitFor(() => getByText('Password and Confirmned Password Mismatch'));
    
    // Assert that the error message is displayed
    expect(errorMessage).toBeInTheDocument();
  });

  test('Display error message when sign-in fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Error signing user'));

  const { getByLabelText, getByText, getByPlaceholderText } = render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  // Simulate entering email and password
  fireEvent.change(getByPlaceholderText('Enter your name'), { target: { value: 'abc' } });
  fireEvent.change(getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
  fireEvent.change(getByPlaceholderText('Create password'), { target: { value: 'password123' } });
  fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });

  // Simulate clicking the Log In button
  const logInButton = document.querySelector('input[value="Register Now"]');
  fireEvent.click(logInButton);

  // Wait for the error message to appear
  const errorMessage = await waitFor(() => getByText('Error registering user'));

  // Assert that the error message is displayed
  expect(errorMessage).toBeInTheDocument();
  });
});
