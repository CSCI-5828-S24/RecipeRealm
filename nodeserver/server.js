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

app.use('/images', express.static('./images'));

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
    res.status(201).json({ message: 'User Saved Succesfully', user_name:newUser.name, user_email:newUser.email});
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
        res.status(200).json({ message: "Success", user_name:user.name, user_email:user.email });
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
  //console.log(req.body.author_name,req.body.author_email);
  const recipe = await RecipeDataModel.create({
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    image:{
    fileName: req.file.originalname,
    filePath: req.file.filename,
    },
    comments:{
      comment:'',
      commentator:'',
    },
    steps:req.body.steps,
    author:{
      name:req.body.author_name,
      email:req.body.author_email
    }
  })
  await recipe.save();
  // Save the file to MongoDB and return the image URL
  res.send({ recipe });
});

app.get('/api/query', async (req,res) =>{
  const {key} = req.query;
  if(key===''){
    try {
      const recipies = await RecipeDataModel.find({});
      return res.status(200).json(recipies);
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  try {
    const recipes = await RecipeDataModel.find({
      $or: [
        { title: { $regex: key, $options: 'i' } },
        { description: { $regex: key, $options: 'i' } },
        { ingredients: { $regex: key, $options: 'i' } },
        { author: { $regex: key, $options: 'i' } },
      ]
    });
    return res.status(200).json(recipes);
  } catch (error) {
    console.error('Error searching:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/recipes/:id/like', async (req, res) => {
  const { id } = req.params;
  const { user_email,liked } = req.body;
  console.log(user_email,liked)
  try {
    // Find the recipe by ID and update the likes count
    const recipe = await RecipeDataModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    if(liked){
    recipe.likedby.push(user_email);
    }
    else{
      recipe.likedby.pull(user_email );
    }
    const updatedRecipe = await recipe.save()
    res.status(201).json(updatedRecipe);
  } catch (error) {
    console.error('Error updating like count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/recipes/:id/postcomment', async (req, res) => {
  const { id } = req.params;
  const { comment, commentator } = req.body;
  try {
    // Find the recipe by ID and update the likes count
    const recipe = await RecipeDataModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    recipe.comments.push({ comment, commentator });
    const updatedRecipe = await recipe.save();
    res.status(201).json(updatedRecipe);

  } catch (error) {
    console.error('Error updating like count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
