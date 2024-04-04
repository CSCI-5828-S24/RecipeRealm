const mongoose = require('mongoose');

// Define a schema
const formDataSchema = new mongoose.Schema({
  data: String // Modify this based on your data structure
});

// Create a model
const FormDataModel = mongoose.model('FormData', formDataSchema);
module.exports = FormDataModel;