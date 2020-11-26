const express = require('express');
const authController = require('../controllers/authController');
const replyController = require('../controllers/replyController');
const likeController = require('../controllers/likeController');

const router = express.Router();

router
  .route('/:id/likes')
  .post(authController.protect, likeController.createLike);

router
  .route('/:id/reply')
  .post(authController.protect, replyController.createReply);

module.exports = router;
