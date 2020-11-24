const express = require('express');
const authController = require('../controllers/authController');
const replyController = require('../controllers/replyController');

const router = express.Router();

router
  .route('/:id/reply')
  .post(authController.protect, replyController.createReply);

module.exports = router;
