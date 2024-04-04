import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

function Form() {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [savedData, setSavedData] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://reciperealm-7cp9.onrender.com/form-data', {
        data: inputValue
      });
      console.log(response.data); // Log the response from the server
      setMessage(response.data.message);
      setSavedData(response.data.savedData);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again later.');
    }
  };



  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <h2>Simple Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter something..."
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
      {savedData && (
        <div>
          <h3>Saved Data</h3>
          <pre>Data: {savedData.data}</pre>
          <pre>Id: {savedData._id}</pre>
        </div>
      )}
    </div>
  );
}

export default Form;
