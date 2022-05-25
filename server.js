const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const Book = require("./models/book");
const methodOverride = require("method-override");
const booksController = require("./controllers/books");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(booksController);

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " is mongo not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

// Seed Data
const bookSeed = require("./models/bookSeed.js");
app.get("/books/seed", (req, res) => {
  Book.deleteMany({}, (error, allBooks) => {});
  Book.create(bookSeed, (error, data) => {
    res.redirect("/books");
  });
});
// Create
app.post("/books", (req, res) => {
  if (req.body.completed === "on") {
    req.body.completed = true;
  } else {
    req.body.completed = false;
  }
  Book.create(req.body, (error, createdBook) => {
    res.redirect("/books");
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
// Show
app.get("/books/:id", (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    res.render("show.ejs", {
      book: foundBook,
    });
  });
});
// Update
app.put("/books/:id", (req, res) => {
  if (req.body.completed === "on") {
    req.body.completed = true;
  } else {
    req.body.completed = false;
  }
  Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
    (error, updatedBook) => {
      res.redirect(`/books/${req.params.id}`);
    }
  );
});
// Edit
app.get("/books/:id/edit", (req, res) => {
  Book.findById(req.params.id, (error, foundBook) => {
    res.render("edit.ejs", {
      book: foundBook,
    });
  });
});
// Delete
app.delete("/books/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id, (err, data) => {
    res.redirect("/books");
  });
});

app.listen(PORT);
