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
      likes: Number,
      author: String,
    },
  });

  const RecipeDataModel = mongoose.model('RecipeData', RecipeSchema);
  module.exports = RecipeDataModel;