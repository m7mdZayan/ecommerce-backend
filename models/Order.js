const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  date: Date,
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
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
