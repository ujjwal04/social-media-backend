const User = require('../model/userModel');
const Post = require('./../model/postModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    attributes: {
      exclude: ['user_id'],
    },
    include: [
      {
        model: User,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.getAllPostsByUser = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: {
      user_id: req.params.id,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    content: req.body.content,
    image: req.body.image ? req.body.image : null,
    user_id: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newPost,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const updatedPost = await Post.update(
    {
      content: req.body.content,
      image: req.body.image ? req.body.image : null,
    },
    {
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      returning: true,
    }
  );

  const result = await Post.findOne({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const deletedPost = await Post.destroy({
    where: {
      id: req.params.id,
      user_id: req.user.id,
    },
  });

  res.status(204).json({
    status: 'success',
    data: 'null',
  });
});
