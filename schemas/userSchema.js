const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
    role:String
  }

   type Query {
    getUsers: [User]
    getUser(id: ID!): User
    verifyToken(token: String!): User
  }

  type Mutation {
    registerUser(input: UserInput!): User
    loginUser(email: String!, password: String!): String
    logoutUser: String
    deleteUser(id: ID!): User
  }
`;

module.exports = userTypeDefs;
