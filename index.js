const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.port || 3000;

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port);
