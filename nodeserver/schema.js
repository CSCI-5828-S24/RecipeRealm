const mongoose = require('mongoose');

// Define a schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Create a model
const UsersDataModel = mongoose.model('UsersData', UserSchema);
module.exports = UsersDataModel;