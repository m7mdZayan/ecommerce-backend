const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
require('express-async-errors');

const products = require('./routes/product');
const error = require('./middleware/error');

const app = express();
const port = process.env.port || 3000;

dotenv.config({ path: "./config.env" });
console.log("process.env.NODE_ENV = ", process.env.NODE_ENV);

//connect to mongoose
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection is successful"));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});
app.use('/api/products', products);
app.use(error);

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
