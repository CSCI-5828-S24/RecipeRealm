const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const multer = require('multer');
const RecipeDataModel = require('./RecipeSchema.js');
const UsersDataModel = require('./UserSchema.js');
const port = process.env.PORT || 3001;
const fs = require('fs');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://shso8405:Cl72GrKwFvvEgKix@cluster0.ib7jtrh.mongodb.net/')
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

  const storage = multer.diskStorage({
    destination: (req, file, cd) => {
      const uploadPath = './images';
      fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the directory exists
      cd(null, uploadPath);
    },
    filename: (req, file, cd) => {
      cd(null, Date.now() + '-' + file.originalname)
    },
  })

  const upload = multer({ storage: storage })
  
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
    return res.status(400).json({ message: 'Already registered' });
  }
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UsersDataModel({ name:name ,email:email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User Saved Succesfully', user:name});
  }
  catch (error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
  
app.post('/api/login', async (req, res)=>{
  // To find record from the database
  try {
    const { email, password } = req.body;
    const user = await UsersDataModel.findOne({ email: email });
    if (user) {
      // If user found
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.status(200).json({ message: "Success", user: user.name });
      } else {
        res.status(500).json({ message: "Wrong password" });
      }
    } else {
      // If user not found
      res.status(500).json({ message: "No records found!" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})


app.post('/api/user/addrecipe', upload.single('image'),async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log()
  const recipe = await RecipeDataModel.create({
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    image:{
    filePath: req.file.filename,
    fileName: req.file.originalname,
    likes:0,
    author:req.body.author
    }
  })
  console.log(recipe)
  await recipe.save();
  // Save the file to MongoDB and return the image URL
  res.send({ recipe });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
