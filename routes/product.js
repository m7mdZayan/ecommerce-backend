const Joi = require("joi");
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const userController = require("../controllers/userController");

router.get(
  "/",
  userController.protect,
  userController.restrictTo("user"),
  async (req, res, next) => {
    const products = await Product.find();
    res.send(products);
  }
);

router.patch("/:id", async (req, res, next) => {
  const { error } = patchValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let id = req.params.id;

  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    useFindAndModify: false,
  });

  if (!product) return res.status(404).send("Product not found");

  res.send(product);
});

router.delete("/:id", async (req, res, next) => {
  let id = req.params.id;

  const product = await Product.findByIdAndRemove(id, {
    useFindAndModify: false,
  });

  if (!product) return res.status(404).send("Product not found");

  res.send(product);
});

router.get("/:id", async (req, res, next) => {
  let id = req.params.id;

  const product = await Product.findById(id);

  if (!product) return res.status(404).send("Product not found");

  res.send(product);
});

function patchValidate(product) {
  const schema = Joi.object({
    title: Joi.string().trim().min(1),
    photo: Joi.string().trim(),
    price: Joi.number(),
    details: Joi.string().trim().min(1),
    amount: Joi.number(),
  });
  return schema.validate(product);
}

module.exports = router;
