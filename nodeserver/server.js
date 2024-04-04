const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const FormDataModel = require('./schema.js');
const port = 3002; // Choose any port you prefer

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://shso8405:Cl72GrKwFvvEgKix@cluster0.ib7jtrh.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));
  
app.use(cors());
// Middleware
app.use(bodyParser.json());

// Routes
app.post('/form-data', async (req, res) => {
    try {
      const formData = req.body.data;
      console.log('Form data received:', formData);
  
      // Create a new document using the model
      const newFormData = new FormDataModel({ data: formData });
  
      // Save the document to MongoDB
      const savedData = await newFormData.save();
  
      console.log('Data saved to MongoDB:', savedData);
  
      res.send({ message: 'Form data received and saved to MongoDB successfully!', savedData });
    } catch (error) {
      console.error('Error processing form data:', error);
      res.status(500).send('Internal server error');
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
