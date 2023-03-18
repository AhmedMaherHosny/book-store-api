const mongoose = require("mongoose");
const Joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cover: {
      type: String,
      required: true,
      eunm: ["Soft Cover", "Hard Cover"],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", BookSchema);

// validate create or update book
function ValidateCreateOrUpdateBook(obj, isCreate) {
  if (isCreate) {
    const schema = Joi.object({
      title: Joi.string().trim().min(3).max(200).required(),
      author: Joi.string().trim().required(),
      description: Joi.string().trim().min(3).required(),
      price: Joi.number().min(0).required(),
      cover: Joi.string().valid("Soft Cover", "Hard Cover").required(),
    });
    return schema.validate(obj);
  }
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200),
    author: Joi.string().trim(),
    description: Joi.string().trim().min(3),
    price: Joi.number().min(0),
    cover: Joi.string().valid("Soft Cover", "Hard Cover"),
  });
  return schema.validate(obj);
}
module.exports = {
  Book,
  ValidateCreateOrUpdateBook,
};
