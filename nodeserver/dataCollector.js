const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const multer = require('multer');
const RecipeDataModel = require('./RecipeSchema.js');
const UsersDataModel = require('./UserSchema.js');
const port = process.env.PORT || 3002;
const fs = require('fs');
const { stringify } = require('querystring');
const axios = require('axios')

app.use(cors());

app.use(bodyParser.json());


app.get('/filter', async (req, res) => {
    const { filter } = req.params;
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
        return res.status(200).json(recipes);
    } 
    }
    catch (error ) {
        console.error('Error fetching data:', error);
        return res.status(500).json({error:error})
    }
  })

  app.listen(port, () => {
    console.log(`Data Collector is running on port ${port}`);
  });