const User = require('../model/userModel');
const Comment = require('./../model/commentModel');
const Reply = require('./../model/replyModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createReply = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const newReply = await Reply.create({
    comment_id: req.params.id,
    content: req.body.content,
    user_id: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newReply,
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

// export const getAllRepliesInAPost = catchAsync(async (req,res,next) => {
//   const replies = await Reply.findAll({
//   })
// })
