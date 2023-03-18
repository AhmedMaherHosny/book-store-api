const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Book, ValidateCreateOrUpdateBook } = require("../models/Book");
const { verifyTokenAndAdmin } = require("../middlewares/verify_token");

/**
 *   @desc Get all books
 *   @route /api/books
 *   @method Get
 *   @access public
 **/
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.find().populate("author", [
      "_id",
      "firstName",
      "lastName",
    ]);
    res.json(books);
  })
);

/**
 *   @desc Get book by id
 *   @route /api/books/:id
 *   @method Get
 *   @access public
 **/
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author");
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found!" });
    }
  })
);

/**
 *   @desc Add book
 *   @route /api/books/
 *   @method Post
 *   @access private (only admins)
 **/
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = ValidateCreateOrUpdateBook(req.body, true);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });
    const result = await book.save();
    res.status(201).json(result);
  })
);

/**
 *   @desc Update book by id
 *   @route /api/books/:id
 *   @method Put
 *   @access private (only admins)
 **/
router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = ValidateCreateOrUpdateBook(req.body, false);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedBook);
  })
);

/**
 *   @desc Delete book by id
 *   @route /api/books/:id
 *   @method Delete
 *   @access private (only admins)
 **/
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "book has been deleted successfully" });
    } else {
      res.status(404).json({ message: "book not found!" });
    }
  })
);

module.exports = router;
