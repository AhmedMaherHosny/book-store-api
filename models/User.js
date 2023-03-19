const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity"); // len <= 8 && one or less lower case && ~ ~ ~ upper case && ~ ~ ~ symbol

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, username: this.username, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY
  );
};

// Validate Create Or Update User
function validateCreateOrUpdateUser(obj, isCreate) {
  if (isCreate) {
    const userValidationSchema = Joi.object({
      email: Joi.string().trim().min(5).max(100).email().required(),
      username: Joi.string().min(2).max(200).required(),
      password: passwordComplexity().required(),
    });
    return userValidationSchema.validate(obj);
  } else {
    const userValidationSchema = Joi.object({
      email: Joi.string().email(),
      username: Joi.string().min(2).max(200),
      password: Joi.string().min(6),
      isAdmin: Joi.bool(),
    });
    return userValidationSchema.validate(obj);
  }
}

// Validate Login User
function validateLoginUser(obj) {
  const userValidationSchema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email().required(),
    password: Joi.string().trim().min(6).required(),
  });
  return userValidationSchema.validate(obj);
}

// Validate Change Password
function validateChangePassword(obj) {
  const schema = Joi.object({
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}

const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
  validateCreateOrUpdateUser,
  validateLoginUser,
  validateChangePassword,
};
