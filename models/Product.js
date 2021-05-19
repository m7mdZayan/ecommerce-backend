const Joi = require('joi');
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title!"],
    trim: true,
  },
  photo: String,
  price: { type: Number, required: [true, "please enter the price "] },
  details: {
    type: String,
    required: [true, "Please describe the product "],
    trim: true
  },
  amount: { type: Number, required: [true, "Please enter price "] },
});

function validateProduct(product) {
  const schema = Joi.object({
      title: Joi.string().min(1).required(),
      photo: Joi.string().allow(""),
      price: Joi.number().required(),
      details: Joi.string().min(1).required(),
      amount: Joi.number().required(),
  }); 
  return schema.validate(product);
}

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
module.exports.validate = validateProduct;
