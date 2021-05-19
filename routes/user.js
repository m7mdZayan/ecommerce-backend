const express = require("express");
const userController = require("../controllers/userController");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();


// console.log("in user route");
router.post("/signup", userController.signup);
router.post("/login", userController.login);




router.get('/:id',(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .populate("orders")
    .then(user=>{
        Order.findOne({user:req.params.id})
        .exec((err,orders)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json({user})
            }
        })
        // console.log({user})
    })
    .catch(err=>{
        return res.status(422).json({error: err})
    })
})


router.get('/order/:orderid',(req,res)=>{
    // Post.find().populate('postedBy','name')
    Order.findOne({_id:req.params.orderid})
    .populate("products")
    .then(order=>{
        res.json({order})
    })
    .catch(err=>{
        return res.status(422).json({error: err})
    })
})

router.patch("/:Id", (req, res) => {
    const id = req.params.Id;
    const updateOps = req.body;
    
    User.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'updated successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/api/users/' + id
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;

