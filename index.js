const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const orderRouter = require("./routes/order");
require("./models/User");
require("express-async-errors");
const products = require("./routes/product");
const error = require("./middleware/error");
// const Product = require("./models/Product");
const userRouter = require("./routes/user");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser())
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

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});

app.use(express.json());
const corsOptions = {
  origin: 'http://127.0.0.1:4200',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions ));


app.use("/api/orders", orderRouter);

// app.get("/", (req, res) => {
//   res.send("hello");
// });

app.use("/api/products", products);
app.use("/api/users", userRouter);
app.all("*", (req, res, next) => {
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
