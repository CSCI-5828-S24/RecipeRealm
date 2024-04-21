const mongoose = require('mongoose');

// Define a schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  savedRecipies:[
    {
    recipe_id:{
      type:String
    }
  }
  ],
});




// Create a model
const UsersDataModel = mongoose.model('UsersData', UserSchema);

module.exports = UsersDataModel;