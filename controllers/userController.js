const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const Post = require('../model/postModel');
const Comment = require('../model/commentModel');
const PostLike = require('../model/postLikeModel');
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
    include: [
      {
        model: Post,
        include: [
          {
            model: PostLike,
          },
          {
            model: Comment,
            include: [{ model: User }],
            order: [['createdAt', 'DESC']],
          },
        ],
      },
    ],
    where: {
      user_name: req.params.id,
    },
    order: [[Post, 'createdAt', 'DESC']],
  });

  if (!user) {
    return next(new AppError('User with this user name does not exist', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for updating password', 400));

  // 2) Check for the existing user in db
  const updatedUser = await User.findOne({
    attributes: {
      include: ['password'],
    },
    where: {
      id: req.user.id,
    },
  });

  await updatedUser.update(req.body, {
    where: {
      id: req.user.id,
    },
    hooks: false,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: updatedUser.id,
        user_name: updatedUser.user_name,
        name: updatedUser.name,
        profile_pic: updatedUser.profile_pic,
        createdAt: updatedUser.createdAt,
        bio: updatedUser.bio,
        email: updatedUser.email,
      },
    },
  });
});
