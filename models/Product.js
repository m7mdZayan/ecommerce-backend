const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title!"],
  },
  photo: String,
  price: { type: Number, required: [true, "please enter the price "] },
  details: {
    type: String,
    required: [true, "Please describe the product "],
  },
  amount: { type: Number, required: [true, "Please enter price "] },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
