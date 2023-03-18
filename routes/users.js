const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const { User, validateCreateOrUpdateUser } = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verify_token");
/**
 *   @desc Update user
 *   @route /api/users/:id
 *   @method Put
 *   @access private
 **/
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const { error } = validateCreateOrUpdateUser(req.body, false);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      req.body.password = await bcryptjs.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(updatedUser);
  })
);

/**
 *   @desc Get all users
 *   @route /api/users/
 *   @method Get
 *   @access private (only admin)
 **/
router.get(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  })
);

/**
 *   @desc Get user by id
 *   @route /api/users/:id
 *   @method Get
 *   @access private (only admin and the account owner)
 **/
router.get(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  })
);

/**
 *   @desc Delete user by id
 *   @route /api/users/:id
 *   @method Delte
 *   @access private (only admin and the account owner)
 **/
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user deleted succsefully!" });
  })
);

module.exports = router;
