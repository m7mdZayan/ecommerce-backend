const mongoose = require("mongoose");
require("./Product");

const orderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  totalPrice: { type: Number, required: [true, "Please enter total price "] },
  state: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
