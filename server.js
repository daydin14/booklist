const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));

const mongoose = require("mongoose");
const Book = require("./models/book");
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " is mongo not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

// Create
app.post("/books", (req, res) => {
  if (req.body.completed === "on") {
    req.body.completed = true;
  } else {
    req.body.completed = false;
  }
  Book.create(req.body, (error, createdBook) => {
    res.send(createdBook);
  });
});
// New
app.get("/books/new", (req, res) => {
  res.render("new.ejs");
});
// Index
app.get("/books", (req, res) => {
  Book.find({}, (error, allBooks) => {
    res.render("index.ejs", { books: allBooks });
  });
});

app.listen(PORT);
