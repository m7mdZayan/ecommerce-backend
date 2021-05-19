const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const orderRouter = express.Router();

orderRouter.get("/", async (req, res) => {
  const orders = await Order.find().populate("products");
  //   const orders = await Order.find();
  res.send(orders);
});

orderRouter.post("/", async (req, res) => {
  order = new Order({
    totalPrice: req.body.totalPrice,
    state: "pending",
    products: req.body.products,
  });

  order = await order.save();
  res.send(order);
});

orderRouter.put("/", async (req, res) => {
  res.send("edit status");
});

module.exports = orderRouter;
