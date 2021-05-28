const express = require("express");
const userController = require("../controllers/userController");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/logout", userController.protect, userController.logout);

router.get("/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .populate("orders")
    .populate({path:"orders", populate:"products"})
    .then((user) => {
      Order.findOne({ user: req.params.id }).exec((err, orders) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          res.json({ user });
        }
      });
      // console.log({user})
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});


router.patch("/:Id", (req, res) => {
  const id = req.params.Id;
  const updateOps = req.body;

  User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "updated successfully",
        request: {
          type: "GET",
          url: "http://localhost:3000/api/users/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get('/get/count',async (req,res)=>{
  const userCount = await User.countDocuments((count)=> count)
  if(!userCount){
      res.status(500).json({
          success: false
      })
  }
  data = [{count: userCount}]
  res.send(data)
})

module.exports = router;
