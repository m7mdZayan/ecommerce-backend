const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");

const userController = require("../controllers/userController");

const orderRouter = express.Router();

orderRouter.get("/", async (req, res) => {
  const orders = await Order.find().populate("products").populate("owner");
  res.send(orders);
});

orderRouter.post("/", userController.protect, async (req, res) => {
  order = new Order({
    totalPrice: req.body.totalPrice,
    state: "pending",
    products: req.body.products,
    owner: req.body.owner,
  });

  order = await order.save();

  User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { orders: order._id },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
    // res.send(order);
  });
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

// orderRouter.put('/like',userController.protect, (req, res)=>{
//   User.findByIdAndUpdate(req.user._id,{
//     $push:{orders:req.user._id}
//   },{new:true})
//   .exec((err,result)=>{
//   if(err){
//     return res.status(422).json({ error: err})

//   }else{
//     res.json(result)
//   }
// })

orderRouter.get('/get/totalsales', async (req, res)=> {
  const totalSales= await Order.aggregate([
      { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
  ])

  if(!totalSales) {
      return res.status(400).send('The order sales cannot be generated')
  }
  let data = [
    {
      totalsales: totalSales.pop().totalsales
    }
  ]

  res.send(data)
})

orderRouter.get('/get/count', async (req, res) =>{
  const orderCount = await Order.countDocuments((count) => count)

  if(!orderCount) {
      res.status(500).json({success: false})
  } 

  let data  = 
    [
      {orderCount: orderCount,
      message: "all prodcuts in store"}
    ]
  
  res.send(data);
})

module.exports = orderRouter;
