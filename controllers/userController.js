const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).cookie('jwt', token).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!password || !email)
    return next(new AppError("please provide email and password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
   //console.log("req.headers.authorization = ", req.headers.authorization);
  // console.log("req.cookies = ", req.cookies);
//console.log("req = ", req);
//console.log("req.headers = ", req.headers);
//console.log("req.headers.Cookie = ", req.headers.cookie);
//console.log("Cookie = ", req.headers.cookie.trim().split("=")[1]);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("you are not logged in, please log in to get access", 401)
    );
  }
console.log("token = ", token);
  const decode = jwt.verify(token, process.env.JWT_SECRET);
   //console.log("decode = ", decode);
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token no longer exist", 401)
    );
  }

  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError("user recently changed password please log in again", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you are not allowed to perform this action", 403)
      );
    }
    next();
  };
};
