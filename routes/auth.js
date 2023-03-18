const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const {
  User,
  validateCreateOrUpdateUser,
  validateLoginUser,
} = require("../models/User");

/**
 *   @desc Register new user
 *   @route /api/auth/register
 *   @method Post
 *   @access public
 **/
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateOrUpdateUser(req.body, true);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "This e-mail already exist!" });
    }
    const salt = await bcryptjs.genSalt(10);
    req.body.password = await bcryptjs.hash(req.body.password, salt);
    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    const result = await user.save();
    const token = user.generateToken();
    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
  })
);

/**
 *   @desc Login user
 *   @route /api/auth/login
 *   @method Post
 *   @access public
 **/
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body, true);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid e-mail or password" });
    }
    const isPasswordMatches = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatches) {
      return res.status(400).json({ message: "Invalid e-mail or password" });
    }
    const token = user.generateToken();
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
  })
);

module.exports = router;
