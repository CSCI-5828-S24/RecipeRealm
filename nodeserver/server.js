const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const UsersDataModel = require('./schema.js');
const port = process.env.PORT || 3001;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://shso8405:Cl72GrKwFvvEgKix@cluster0.ib7jtrh.mongodb.net/')
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));
  
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use(express.static('../my-from-app/public'))

app.use(express.static('../my-from-app/src/Styles'))

app.post('/api/register', async (req,res) =>{
  const {name,email,password,confpassword} = req.body
  const existingUser = await UsersDataModel.findOne({ email });
  if (password!==confpassword){
    return res.status(400).json({ message: 'Password Mismatch' });
  }
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UsersDataModel({ name:name ,email:email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User Saved Succesfully'});
  }
  catch (error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
