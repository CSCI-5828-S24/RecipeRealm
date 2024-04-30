// import React from 'react';
// import { render, fireEvent, waitFor, waitForElement, getByRole, getByText, getByDisplayValue, findByText, queryByText, findByTestId } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
// import SignIn from '../../Components/SignIn'; 

// describe('SignIn Component', () => {
//   test('Render login form with "Log In" button', async () => {
//       const { getByDisplayValue } = render(
//         <MemoryRouter>
//           <SignIn />
//         </MemoryRouter>
//       );
  
//       // Verify that the "Log In" button is rendered
//       const logInButton = getByDisplayValue('Log In');
//       expect(logInButton).toBeInTheDocument();
//     });

//     test('Submitting login form with either empty email or password inputs', async () => {
//       const { container, findByText } = render(
//         <MemoryRouter>
//           <SignIn />
//         </MemoryRouter>
//       );
    
//       const logInButton = container.querySelector('input[value="Log In"]');
//       fireEvent.click(logInButton);
    
//       // Wait for a brief moment to allow the component to render the error message
//       await new Promise(resolve => setTimeout(resolve, 100));
    
//       // Check for the error message
//       const errorMessage = await findByText(/enter all the fields/i);
    
//       expect(errorMessage).toBeInTheDocument();
//     });
    
    


//   test('Submitting login form with invalid email', () => {
//     const { getByPlaceholderText, getByText } = render(
//       <MemoryRouter>
//         <SignIn />
//       </MemoryRouter>
//     );

//     // Simulate entering an invalid email
//     const emailInput = getByPlaceholderText('Enter your email');
//     fireEvent.change(emailInput, { target: { value: 'invalidemail' } });

//     // Simulate clicking the Log In button
//     const logInButton = document.querySelector('input[value="Log In"]');
//     fireEvent.click(logInButton);

//     // Check if the error message is present
//     const errorMessage = getByText('Please enter a valid email');
//     expect(errorMessage).toBeInTheDocument();
//   });

  
//   test('Display error message when sign-in fails', async () => {
//       jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Error signing user'));

//     const { getByLabelText, getByText, getByPlaceholderText } = render(
//       <MemoryRouter>
//         <SignIn />
//       </MemoryRouter>
//     );

//     // Simulate entering email and password
//     fireEvent.change(getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
//     fireEvent.change(getByPlaceholderText('Create password'), { target: { value: 'password123' } });

//     // Simulate clicking the Log In button
//     const logInButton = document.querySelector('input[value="Log In"]');
//     fireEvent.click(logInButton);

//     // Wait for the error message to appear
//     const errorMessage = await waitFor(() => getByText('Error Signing user'));

//     // Assert that the error message is displayed
//     expect(errorMessage).toBeInTheDocument();
//     });

// });

// SignIn.integration.test.js

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../../Components/SignIn';

describe('SignIn Component - Integration Tests', () => {
  test('Sign In with Valid Credentials', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ message: 'Success', user_name: 'John', user_email: 'john@example.com' }),
      status: 200,
    });

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Create password');
    const logInButton = document.querySelector('input[value="Log In"]');

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(logInButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_SERVER_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'john@example.com', password: 'password' }),
      });
      expect(sessionStorage.getItem('user_name')).toEqual('John');
      expect(sessionStorage.getItem('user_email')).toEqual('john@example.com');
    });
  });

  test('Sign In with Empty Email', async () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const passwordInput = getByPlaceholderText('Create password');
    const logInButton = document.querySelector('input[value="Log In"]');

    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(logInButton);

    const errorMessage = getByText('Enter all the fields');
    expect(errorMessage).toBeInTheDocument();
  });


  test('Display error message when sign-in fails', async () => {
          jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Error signing user'));
    
        const { getByLabelText, getByText, getByPlaceholderText } = render(
          <MemoryRouter>
            <SignIn />
          </MemoryRouter>
        );
    
        // Simulate entering email and password
        fireEvent.change(getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
        fireEvent.change(getByPlaceholderText('Create password'), { target: { value: 'password123' } });
    
        // Simulate clicking the Log In button
        const logInButton = document.querySelector('input[value="Log In"]');
        fireEvent.click(logInButton);
    
        // Wait for the error message to appear
        const errorMessage = await waitFor(() => getByText('Error Signing user'));
    
        // Assert that the error message is displayed
        expect(errorMessage).toBeInTheDocument();
    });

});

