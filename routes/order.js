const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const orderRouter = express.Router();

orderRouter.get("/", async (req, res) => {
  const orders = await Order.find().populate("products").populate("owner");
  res.send(orders);
});

orderRouter.post("/", async (req, res) => {
  order = new Order({
    totalPrice: req.body.totalPrice,
    state: "pending",
    products: req.body.products,
    owner: req.body.owner,
  });

  order = await order.save();
  res.send(order);
});

orderRouter.put("/", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        state: req.body.state,
      },
    },
    {
      new: true,
    }
  );

  res.send(order);
});

orderRouter.delete("/", async (req, res) => {
  const result = await Order.deleteOne({ _id: req.body.id });
  res.send(result);
});

module.exports = orderRouter;
