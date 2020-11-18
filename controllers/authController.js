const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    user_name: req.body.user_name,
    name: req.body.name,
    profile_pic: req.body.profile_pic ? req.body.profile_pic : null,
    password: req.body.password,
    passwordChangedAt: req.body.passwordChangedAt
      ? req.body.passwordChangedAt
      : null,
  });

  const token = signToken(newUser.id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: newUser.id,
        user_name: newUser.user_name,
        profile_pic: newUser.profile_pic,
        createdAt: newUser.createdAt,
      },
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { user_name, password } = req.body;

  // 1) Check if user_name and password exist
  if (!user_name || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({
    attributes: {
      include: ['password'],
    },
    where: {
      user_name,
    },
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  // 3) If everything ok,send token to client
  const token = signToken(user.id);
  res.status(200).json({
    sttaus: 'success',
    token,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const freshUser = await User.findOne({
    attributes: {
      include: ['password'],
    },
    where: {
      id: decoded.id,
    },
  });
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed passwords after the JWT was issued
  // freshUser.changedPasswordAfter(decoded.iat);

  // GRANT ACCESS
  req.user = freshUser;
  next();
});
