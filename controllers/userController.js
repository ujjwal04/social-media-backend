const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.destroy({
    where: {
      id: req.user.id,
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    attributes: {
      exclude: ['passwordChangedAt'],
    },
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
