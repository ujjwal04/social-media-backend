const express = require('express');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, authController.updateUser)
  .delete(authController.protect, userController.deleteUser);

router
  .route('/:id/posts')
  .get(authController.protect, postController.getAllPostsByUser);

router
  .route('/updateMyPassword')
  .post(authController.protect, authController.updatePassword);

module.exports = router;
