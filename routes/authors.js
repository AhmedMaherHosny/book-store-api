const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Author, ValidateCreateOrUpdateAuthor } = require("../models/Author");
const { verifyTokenAndAdmin } = require("../middlewares/verify_token");

/**
 *   @desc Get all authors
 *   @route /api/authors
 *   @method Get
 *   @access public
 **/
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const authorsList = await Author.find();
    res.status(200).json(authorsList);
  })
);

/**
 *   @desc Get author by id
 *   @route /api/authors/:id
 *   @method Get
 *   @access public
 **/
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ message: "Author not found!" });
    }
  })
);

/**
 *   @desc Add author
 *   @route /api/authors/
 *   @method Post
 *   @access private (only admins)
 **/
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = ValidateCreateOrUpdateAuthor(req.body, true);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const author = new Author({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      nationality: req.body.nationality.trim(),
      image: req.body.image,
    });
    const result = await author.save();
    res.status(201).json(result);
  })
);

/**
 *   @desc Update author by id
 *   @route /api/authors/:id
 *   @method Put
 *   @access private (only admins)
 **/
router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = ValidateCreateOrUpdateAuthor(req.body, false);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nationality: req.body.nationality,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedAuthor);
  })
);

/**
 *   @desc Delete author by id
 *   @route /api/authors/:id
 *   @method Delete
 *   @access private (only admins)
 **/
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "author has been deleted successfully" });
    } else {
      res.status(404).json({ message: "author not found!" });
    }
  })
);

module.exports = router;
