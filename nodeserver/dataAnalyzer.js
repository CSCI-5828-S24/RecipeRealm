const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const multer = require('multer');
const RecipeDataModel = require('./RecipeSchema.js');
const port = process.env.PORT || 3003;
const fs = require('fs');
const { stringify } = require('querystring');
const axios = require('axios')

app.use(cors());

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://shso8405:Cl72GrKwFvvEgKix@cluster0.ib7jtrh.mongodb.net/')
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));


app.get('/dataAnalyzer/sortCalories', async (req, res) => {
    let filter = req.query.filter;
    let caloriesLimit = req.query.caloriesLimit;
    const app_id = 'cde872aa'
    const app_key = '443cd8985df97b1141c3af7be32b439f'

    if(caloriesLimit==='')
        caloriesLimit = '5000'
    if(filter=='')
        filter = 'mexican'

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
        const sortedRecipies =  recipes.filter(recipe => {
            return Number(recipe.calories) <= Number(caloriesLimit);
          }).sort((a, b) => a.calories - b.calories);
        
        return res.status(200).json(sortedRecipies);
    } 
    }
    catch (error ) {
        console.error('Error fetching data:', error);
        return res.status(500).json({error:error})
    }
  })



  app.get('/dataAnalyzer/likes', async (req, res) => {

    try{
        const recipies = await RecipeDataModel.find({});
        recipies.sort((a, b) => b.likedby.length - a.likedby.length );
        return res.status(200).json(recipies)
      }
        catch (error ) {
          console.error('Error fetching data:', error);
          return res.status(500).json({error:error})
        }
  })

  app.listen(port, () => {
    console.log(`Data Analyzer is running on port ${port}`);
  });