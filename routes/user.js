const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();
// console.log("in user route");
router.post("/signup", userController.signup);
// router.post("/login", userController.login);
module.exports = router;
