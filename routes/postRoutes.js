const express = require('express');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const likeController = require('../controllers/likeController');
const commentController = require('../controllers/commentController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, postController.getAllPosts)
  .post(authController.protect, postController.createPost);

router
  .route('/:id')
  .get(authController.protect, postController.getPost)
  .patch(authController.protect, postController.updatePost)
  .delete(authController.protect, postController.deletePost);

router
  .route('/:id/likes')
  .post(authController.protect, likeController.createLike)
  .delete(authController.protect, likeController.deleteLike);

router
  .route('/:id/likes')
  .get(authController.protect, likeController.createLike);

router
  .route('/:id/comments')
  .post(authController.protect, commentController.createComment);

router
  .route('/:id/comments')
  .get(authController.protect, commentController.getAllCommentsInAPost);

module.exports = router;
