const User = require('../model/userModel');
const Post = require('./../model/postModel');
const Like = require('./../model/likeModel');
const PostLike = require('./../model/postLikeModel');
const CommentLike = require('./../model/commentLikeModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createLike = catchAsync(async (req, res, next) => {
  const newLike = await Like.create({
    user_id: req.user.id,
    type: req.body.type,
    emoji: req.body.emoji,
  });

  let likeType;
  if (newLike.type === 'comment') {
    likeType = await CommentLike.create({
      like_id: newLike.id,
      comment_id: req.body.comment_id,
    });
  } else if (newLike.type === 'post') {
    likeType = await PostLike.create({
      like_id: newLike.id,
      post_id: req.body.post_id,
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      newLike,
    },
  });
});

exports.deleteLike = catchAsync(async (req, res, next) => {
  const newLike = await Like.destroy(
    {
      user_id: req.user.id,
      post_id: req.body.post_id,
      type: req.body.type,
    },
    {
      where: {
        user_id: req.user.id,
        post_id: req.body.post_id,
      },
    }
  );

  res.status(201).json({
    status: 'success',
    data: {
      newLike,
    },
  });
});
