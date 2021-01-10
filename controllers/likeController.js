const User = require('../model/userModel');
const Post = require('./../model/postModel');
const Like = require('./../model/likeModel');
const PostLike = require('./../model/postLikeModel');
const CommentLike = require('./../model/commentLikeModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createLike = catchAsync(async (req, res, next) => {
  let newLike;
  if (req.body.type === 'comment') {
    newLike = await CommentLike.create({
      comment_id: req.params.id - '0',
      user_id: req.user.id,
      type: req.body.type,
      emoji: req.body.emoji,
    });
  } else if (req.body.type === 'post') {
    newLike = await PostLike.create({
      post_id: req.params.id - '0',
      user_id: req.user.id,
      type: req.body.type,
      emoji: req.body.emoji,
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      newLike,
    },
  });
});

exports.getAllLikesInPost = catchAsync(async (req, res, next) => {
  const likes = await PostLike.findAll({
    where: {
      post_id: req.params.id,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      likes,
    },
  });
});

exports.deleteLikeOnAPost = catchAsync(async (req, res, next) => {
  const postlike = await PostLike.findOne({
    where: {
      user_id: req.user.id,
      post_id: req.params.id - '0',
    },
  });

  await postlike.destroy();

  res.status(201).json({
    status: 'success',
    data: null,
  });
});

exports.getAllLikesByAUser = catchAsync(async (req, res, next) => {
  const likesByUser = await PostLike.findAll({
    where: {
      user_id: req.user.id,
    },
  });
  res.status(200).json({
    status: 'success',
    results: likesByUser.length,
    data: {
      likesByUser,
    },
  });
});
