const mongoose = require('mongoose');

// Define the schema for the Book model
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for ownership
  },
});

// Create the Book model based on the schema
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
