import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../../Components/SignUp';

// Import the register function from the mock
import { register } from '../../__mocks__/authAPI';

jest.mock('../../__mocks__/authAPI');

describe('SignUp Component', () => {
  test('should register user successfully', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      confpassword: 'test123',
    };

    // Mock the register function to resolve with a successful response
    register.mockResolvedValue({ success: true });

    // Mock the fetch function
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const nameInput = getByPlaceholderText('Enter your name');
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Create password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');

    fireEvent.change(nameInput, { target: { value: newUser.name } });
    fireEvent.change(emailInput, { target: { value: newUser.email } });
    fireEvent.change(passwordInput, { target: { value: newUser.password } });
    fireEvent.change(confirmPasswordInput, { target: { value: newUser.confpassword } });

    const signupButton = document.querySelector('input[value="Register Now"]');
    fireEvent.click(signupButton);

     // Wait for the registration process to complete
     await waitFor(() => {
      // Verify that the fetch function was called with the correct URL and options
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_SERVER_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
    });
  });
});