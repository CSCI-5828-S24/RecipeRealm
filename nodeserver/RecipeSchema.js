const mongoose = require('mongoose');

const RecipeSchema =  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    image: {
      fileName: {
        type: String,
        required: true,
      },
      filePath: {
        type: String,
        required: true,
      },
    },
    steps:{
      type: String,
      required: true,
    },
    comments:[{
      comment:{
        type:String,
      },
      commentator:{
        type: String,
      }
    }],
    likes:{
      type: Number,
    },
    author:{
      type: String,
    }
  });

  const RecipeDataModel = mongoose.model('RecipeData', RecipeSchema);
  module.exports = RecipeDataModel;