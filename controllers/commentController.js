const User = require('../model/userModel');
const Post = require('./../model/postModel');
const Like = require('./../model/likeModel');
const PostLike = require('./../model/postLikeModel');
const Comment = require('./../model/commentModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create({
    post_id: req.params.id,
    content: req.body.content,
    user_id: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newComment,
    },
  });
});

exports.getAllCommentsInAPost = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    include: [
      {
        model: User,
      },
    ],
    where: {
      post_id: req.params.id,
    },
  });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});
