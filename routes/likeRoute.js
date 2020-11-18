const express = require('express');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const likeController = require('../controllers/likeController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, likeController.createLike)
  .delete(authController.protect, likeController.deleteLike);

router
  .route('/:id')
  .get(authController.protect, postController.getPost)
  .patch(authController.protect, postController.updatePost)
  .delete(authController.protect, postController.deletePost);

module.exports = router;
