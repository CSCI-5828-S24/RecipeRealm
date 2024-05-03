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
const { stringify } = require('querystring');
const axios = require('axios')

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
    res.status(201).json({ message: 'User Saved Succesfully', user_name:newUser.name, user_email:newUser.email, user_saved_recipies: newUser.savedRecipies});
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
        res.status(200).json({ message: "Success", user_name:user.name, user_email:user.email ,user_saved_recipies: user.savedRecipies});
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


app.post('/api/user/addrecipe', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log(req.body, req.file.originalname)
  try{
    const recipe = await RecipeDataModel.create({
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    image:{
    fileName: req.file.originalname,
    filePath: req.file.filename,
    },
    steps:req.body.steps,
    author:{
      name:req.body.author_name,
      email:req.body.author_email
    },
    source:'mongoDB'
  })
  await recipe.save();
  res.status(201).json(recipe)
  } catch(error){
    console.error('Error saving recipe:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  const { title, description, ingredients, steps } = req.body;

  try {
    const updatedRecipe = await RecipeDataModel.findByIdAndUpdate(
      recipeId,
      { title, description, ingredients, steps },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(201).json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/user/saverecipe/:id', async (req,res) =>{
  const {user_email,saved} = req.body
  const { id } = req.params;
  try{
    const user = await UsersDataModel.findOne({ email: user_email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if(saved){
      user.savedRecipies.push(id)
    }
    else{
      user.savedRecipies.pull(id)
    }
    const updatedUser =  await user.save();
    res.status(201).json(updatedUser);
  }
  catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

});

app.get('/api/user/:email', async (req,res) => {
  const {email} = req.params;
  try{
  const user = await UsersDataModel.findOne({ email });
  return res.status(200).json(user);
  }
  catch(error){
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/user/myrecipies/:email', async (req,res) =>{
  const {email} = req.params;
  try{
    const recipies = await RecipeDataModel.find({ 'author.email' : email })
    return res.status(200).json(recipies);
  }
  catch(error){
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/user/mysavedrecipies/:email', async (req,res) =>{
  const {email} = req.params;
  console.log(email)
  try{
    const user  = await UsersDataModel.findOne({ email: email });
    const savedRecipies = user.savedRecipies
    console.log(savedRecipies)
    const recipies = await RecipeDataModel.find({ _id: { $in: savedRecipies } });
    return res.status(200).json(recipies);
  }
  catch(error){
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/user/logout', async (req,res) => {
  try{
    return res.status(200).json({ message: 'Logout successful' });
  } catch(error){
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/query', async (req,res) =>{
  const {key,calories} = req.query;
  let api_recipes = await dataCollector(key);
  console.log(api_recipes.length)
  api_recipes = await caloriesDataAnalyser(api_recipes,calories)
  console.log(api_recipes.length)
  if(key==='' || key==='all'){
    try {
      const recipies = await RecipeDataModel.find({});
      return res.status(200).json(recipies.concat(api_recipes));
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  //iltered_api_recipes = searchRecipesByKeyword(api_recipes,key);
  try {
    const recipes = await RecipeDataModel.find({
      $or: [
        { title: { $regex: key, $options: 'i' } },
        { description: { $regex: key, $options: 'i' } },
        { ingredients: { $regex: key, $options: 'i' } },
        { steps: { $regex: key, $options: 'i' } },
        { 'author.name': { $regex: key, $options: 'i' } },
        { 'author.email': { $regex: key, $options: 'i' } },
      ]
    });
    return res.status(200).json(recipes.concat(api_recipes));
  } catch (error) {
    console.error('Error searching:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the recipe by ID and update the likes count
    const recipe = await RecipeDataModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error retrieving recipe data:', error);
    res.status(500).json({ error: 'Internal server error' });
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

app.delete('/api/recipes/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the recipe by ID and update the likes count
    const recipe = await RecipeDataModel.findByIdAndDelete(id);
    res.status(200).json('Seccesfully deleted the post');
  } catch (error) {
    console.error('Error Deleting the post', error);
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
    console.error('Error posting comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.get('/datacollector', async (req, res) => {
  const recipes = await dataCollector('')
  return res.status(200).json(recipes)
})

const dataCollector = async (filter) => {
  const app_id = 'cde872aa'
  const app_key = '443cd8985df97b1141c3af7be32b439f'
  if(filter==''){
    filter = 'mexican'
  }
  try{
  const response =  await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${app_id}&app_key=${app_key}&q=${filter}`)
  if(response.status == 200){
    const recipes = response.data.hits.map(hit => {
      const recipe = hit.recipe;
      return {
          url: recipe.url,
          title: recipe.label,
          sourceSite:recipe.url,
          sourceName:recipe.source,
          ingredientsLines: recipe.ingredientLines,
          calories: recipe.calories,
          health_labels: recipe.healthLabels,
          dietLabels: recipe.dietLabels,
          cautions: recipe.cautions,
          image: recipe.image,
          source:'edamam'
      };
    })
    return recipes;
  } 
}
  catch (error ) {
    console.error('Error fetching data:', error);
  }
}

app.get('/dataAnalyser/sortCalories', async (req, res) => {
  let recipes = await dataCollector('')
  recipes = await caloriesDataAnalyser(recipes,'2000')
  return res.status(200).json(recipes)
})

const caloriesDataAnalyser = async(recipes,caloriesLimit) => {
  if(caloriesLimit==='')
  caloriesLimit = '5000'
  return recipes.filter(recipe => {
    return Number(recipe.calories) <= Number(caloriesLimit);
  }).sort((a, b) => a.calories - b.calories);
}

app.get('/dataAnalyser/likes', async (req, res) => {
  const recipes = await likesDataAnalyser()
  return res.status(200).json(recipes)
})

const likesDataAnalyser = async() => {
  try{
    const recipies = await RecipeDataModel.find({});
    recipies.sort((a, b) => b.likedby.length - a.likedby.length );
    return recipies
  }
    catch (error ) {
      console.error('Error fetching data:', error);
    }
}


