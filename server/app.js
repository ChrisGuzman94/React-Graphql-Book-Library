const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/BookSchema");
const mongoose = require("mongoose");
const Book = require("./models/book");

const app = express();

// Use cors to prevent cross domain error
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

//DB connection
mongoose.connect(
  "mongodb+srv://5hyCbD5LXIWmvpT6:5hyCbD5LXIWmvpT6@cluster0.i21lx.mongodb.net/cluster0?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.once("open", () => {
  console.log("Connection Succesful");
});

//Server Connection
app.listen(4000, () => console.log("Listening on port 4000"));
