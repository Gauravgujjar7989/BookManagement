require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const bookTypeDefs = require('./schemas/bookSchema');
const userTypeDefs = require('./schemas/userSchema');
const bookResolvers = require('./resolvers/bookResolvers');
const userResolvers = require('./resolvers/userResolvers');
const connectDb = require('./config/db');

const app = express();
connectDb();
// Create an ApolloServer instance
const server = new ApolloServer({
  typeDefs: [bookTypeDefs, userTypeDefs], // Include book and user type definitions
  resolvers: [bookResolvers, userResolvers], // Include book and user resolvers
  context: ({ req }) => {
    const token = req ? req.headers.authorization || '': " ";
    return { token };
  },
});

async function startServer() {
    //await connectDb();

    await server.start();
    server.applyMiddleware({ app });
    app.listen({ port: 4000 }, () =>
      console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  }
  
  startServer().catch(error => console.error(error));