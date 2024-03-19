
require('dotenv').config();

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey=process.env.SECRET_KEY;

const userResolvers = {
  Query: {
    getUsers: async (_, __, { token }) => {
      if (token) {
        
        try {
          const decodedToken = jwt.verify(token.replace('Bearer ', ''),secretKey);
          //console.log('Decoded Token:', decodedToken);
          const userRole = decodedToken.role;
          //console.log('role:', userRole);
          if (userRole !== 'admin') {
            //console.log('User Role:', userRole);
            throw new Error('Unauthorized - Only admins can get users');
          }

          return await User.find();
        } catch (error) {
          throw new Error('Invalid or expired token');
        }
      } else {
        throw new Error('Authentication token is required to get users');
      }

      
    },
    getUser: async (_, { id }, { token }) => {
      // if (user.role !== 'admin' && user._id.toString() !== id) {
      //   throw new Error('Unauthorized - Access denied');
      // }
      if (token) {
        
        try {
          const decodedToken = jwt.verify(token.replace('Bearer ', ''),secretKey);
          //console.log('Decoded Token:', decodedToken);
          const userRole = decodedToken.role;
          //console.log('role:', userRole);
          if (userRole !== 'admin') {
            //console.log('User Role:', userRole);
            throw new Error('Unauthorized - Only admins can get user');
          }

          return await User.findById(id);
        } catch (error) {
          throw new Error('Invalid or expired token');
        }
      } else {
        throw new Error('Authentication token is required to get user');
      }
     
    },
    // verifyToken: async (_, { token }) => {
    //   try {
    //     const decoded = jwt.verify(token, secretKey);
    //     //console.log(decoded);
    //     return decoded;
    //   } catch (error) {
    //     throw new Error('Invalid or expired token');
    //   }
    // },
  },
  Mutation: {
    registerUser: async (_, { input }) => {
      const { username, email, password,role } = input; 
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email is already registered');
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      // const newUser = new User({ ...input, password: hashedPassword });
      const newUser = new User({ username, email, password:hashedPassword, role: role || 'user' });
      try {
        const savedUser = await newUser.save();
        return savedUser;
      } catch (error) {
        throw new Error('Error registering user');
      }
    },
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid password');
      }
      // Generate and return JWT token
      const token = jwt.sign({ userId: user._id,role:user.role }, secretKey, { expiresIn: '1h' });
     // console.log(token);
      return token;
    },
    logoutUser: async (_, __, { user }) => {
      
      return 'Logged out successfully';
    },
    deleteUser: async (_, { id },{ token }) => {
      if (token) {
        
        try {
          const decodedToken = jwt.verify(token.replace('Bearer ', ''),secretKey);
          //console.log('Decoded Token:', decodedToken);
          const userRole = decodedToken.role;
          //console.log('role:', userRole);
          if (userRole !== 'admin') {
            //console.log('User Role:', userRole);
            throw new Error('Unauthorized - Only admins can delete user');
          }

          return await User.findByIdAndDelete(id);
        } catch (error) {
          throw new Error('Invalid or expired token');
        }
      } else {
        throw new Error('Authentication token is required to delete user');
      }

      
    },
  },
};

module.exports = userResolvers;
