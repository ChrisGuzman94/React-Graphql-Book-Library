const graphql = require("graphql");
const _ = require("lodash");
const Author = require("../models/author");
const Book = require("../models/book");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// Make GraphQL Types to be used
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    authorId: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.authorId });
      },
    },
  }),
});
////////////////////////////////////////////////////////

// Make Root Query for each type
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Query for single Book type
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db
        return Book.findById(args.id);
      },
    },
    // Query for single Author type
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db
        return Author.findById(args.id);
      },
    },
    // Query for array of Book type
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      },
    },
    // Query for array of Author type
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      },
    },
  },
});
/////////////////////////////////////////////

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });

        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
