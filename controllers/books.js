// Dependencies
const express = require("express"); // Node Module use the singleton pattern
const bookRouter = express.Router(); // could simplify and call it router not bookRouter // Factory Functtion- function that returns an object once invoked
const Book = require("../models/book");
// Seed
const bookSeed = require("../models/bookSeed");
bookRouter.get("/books/seed", (req, res) => {
  Book.deleteMany({}, (error, allBooks) => {});

  Book.create(bookSeed, (error, data) => {
    res.redirect("/books");
  });
});

// Index
bookRouter.get("/books", (req, res) => {
  Book.find({}, (error, allBooks) => {
    res.render("index.ejs", {
      books: allBooks,
    });
  });
});

// New
bookRouter.get("/books/new", (req, res) => {
  res.render("new.ejs");
});

// Delete
bookRouter.delete("/books/:id", (req, res) => {
  Book.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("/books");
  });
});

// Update
bookRouter.put("/books/:id", (req, res) => {
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

// Create
bookRouter.post("/books", (req, res) => {
  if (req.body.completed === "on") {
    req.body.completed = true;
  } else {
    req.body.completed = false;
  }

  Book.create(req.body, (error, createdBook) => {
    res.redirect("/books");
  });
});

// Edit
bookRouter.get("/books/:id/edit", (req, res) => {
  Book.findById(req.params.id, (error, foundBook) => {
    res.render("edit.ejs", {
      book: foundBook,
    });
  });
});

// Show
bookRouter.get("/books/:id", (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    res.render("show.ejs", {
      book: foundBook,
    });
  });
});

// Exports
module.exports = bookRouter;
