const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Assuming roles are 'user' or 'admin'
    default: 'user',
  },
});

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
