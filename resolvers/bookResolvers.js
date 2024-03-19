
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
const User = require('../models/User');
const mongoose = require('mongoose');
const secretKey=process.env.SECRET_KEY;

const sendNotification = async (recipient, message) => {
  // Placeholder function for sending notifications
  console.log(`Notification sent to ${recipient.username}: ${message}`);
};

const bookResolvers = {
  Query: {
    getBooks: async () => {
      return await Book.find();
    },
    getBook: async (_, { id }) => {
      return await Book.findById(id);
    },
    searchBooks: async (_, { keyword }) => {
        return await Book.find({ $or: [{ title: { $regex: keyword, $options: 'i' } }, { author: { $regex: keyword, $options: 'i' } }] });
      },
      // verifyToken: async (_, { token }) => {
      //   try {
      //   //  console.log('Received Token:', token); 
      //     const decoded = jwt.verify(token, secretKey);
      //    // console.log('Decoded Token:', decoded);
      //     // Perform additional logic with the decoded information if needed
      //     //console.log(decoded);
      //     return decoded;
      //   } catch (error) {
      //     throw new Error('Invalid or expired token');
      //   }
      // },
  },
  Mutation: {
    addBook: async (_, { input }, { token }) => {
       //console.log('Received Token:', token); 
      if (token) {
        
        try {
          const decodedToken = jwt.verify(token.replace('Bearer ', ''),secretKey);
          //console.log('Decoded Token:', decodedToken);
          const userRole = decodedToken.role;
          //console.log('role:', userRole);
          if (userRole !== 'admin') {
            //console.log('User Role:', userRole);
            throw new Error('Unauthorized - Only admins can add new books');
          }

          const newBook = new Book(input);
          return await newBook.save();
        } catch (error) {
          throw new Error('Invalid or expired token');
        }
      } else {
        throw new Error('Authentication token is required to add a new book');
      }
    },
    

    updateBook: async (_, { id, input }, { token }) => {
      const book = await Book.findById(id);
      if (!book) {
        throw new Error('Book not found');
      }
      if (token) {
        
        try {
          const decodedToken = jwt.verify(token.replace('Bearer ', ''),secretKey);
         // console.log('Decoded Token:', decodedToken);
          const userRole = decodedToken.role;
          //console.log('role:', userRole);
          if (userRole !== 'admin') {
           // console.log('User Role:', userRole);
            throw new Error('Unauthorized - Only admins can update books');
          }

          const newBook = new Book(input);
          return await Book.findByIdAndUpdate(id, input, { new: true });
        } catch (error) {
          throw new Error('Invalid or expired token');
        }
      } else {
        throw new Error('Authentication token is required to update book');
      }
     
    },
    deleteBook: async (_, { id }, { token }) => {
      const book = await Book.findById(id);
      if (!book) {
        throw new Error('Book not found');
      }
      if (token) {
        
        try {
          const decodedToken = jwt.verify(token.replace('Bearer ', ''),secretKey);
          //console.log('Decoded Token:', decodedToken);
          const userRole = decodedToken.role;
          //console.log('role:', userRole);
          if (userRole !== 'admin') {
           // console.log('User Role:', userRole);
            throw new Error('Unauthorized - Only admins can delete books');
          }

          
          return await Book.findByIdAndDelete(id);
        } catch (error) {
          throw new Error('Invalid or expired token');
        }
      } else {
        throw new Error('Authentication token is required to update book');
      } 
    },
    borrowBook: async (_, { bookId, userId }) => {
      // Implement logic to handle borrowing a book by updating ownership
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }

      if (book.owner) {
        throw new Error('Book is already owned by another user');
      }
      const ownerId = new mongoose.Types.ObjectId(userId);

      book.owner = ownerId;
      return await book.save();
    },
    buyBook: async (_, { bookId, userId }) => {
      // Implement logic to handle buying a book by updating ownership
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      if (book.owner=== userId) {
        throw new Error('You already own this book');
      }
      if (book.owner) {
        throw new Error('Book is already owned by another user');
      }

      const ownerId = new mongoose.Types.ObjectId(userId);

      book.owner = ownerId;
      return await book.save();
    },
    
    requestToBorrowBook: async (_, { bookId, borrowerId }) => {
      // Implement logic for users to request to borrow a book from another user
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      //console.log(typeof(borrowerId));
      //console.log(typeof(book.owner));
      if (book.owner.toString() === borrowerId) {
        throw new Error('You already own this book');
      }

      const owner = await User.findById(book.owner);
      const borrower = await User.findById(borrowerId);

      // Notify the current owner about the borrowing request
      await sendNotification(owner, `User ${borrower.username} has requested to borrow the book "${book.title}"`);

      // Handle the approval process (for demonstration purposes, automatically approve)
      book.owner = borrowerId;
      return await book.save();
    },
  },
};

module.exports = bookResolvers;
