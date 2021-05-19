const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const userRouter = require("./routes/user");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

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

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // res.status(400).json({
  //   status: "fail",
  //   data: {
  //     message: "there is no page",
  //   },
  // });

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
// const newProduct = new Product({
//   title:"p1",
//   price:50,
//   details:";ld;elfpef[ef0",
//   amount:10
// });

// newProduct.save().then(doc=>{
//   console.log(doc);
// }).catch(err=>{
//   console.log(err);
// })
