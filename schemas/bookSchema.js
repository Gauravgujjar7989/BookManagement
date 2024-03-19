

const { gql } = require('apollo-server-express');

const bookTypeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    genre: String!
    owner:ID
  }

  input BookInput {
    title: String!
    author: String!
    genre: String!
  }

  extend type Query {
    getBooks: [Book]
    getBook(id: ID!): Book
    searchBooks(keyword: String!): [Book]
  }

  extend type Mutation {
    addBook(input: BookInput!): Book
    updateBook(id: ID!, input: BookInput!): Book
    deleteBook(id: ID!): Book
    borrowBook(bookId: ID!, userId: ID!): Book
    buyBook(bookId: ID!, userId: ID!): Book
    requestToBorrowBook(bookId: ID!, borrowerId: ID!): Book
  }
`;

module.exports = bookTypeDefs;
