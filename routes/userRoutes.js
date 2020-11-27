const express = require('express');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router
  .route('/updateMyPassword')
  .patch(authController.protect, authController.updatePassword);

router
  .route('/updateProfilePic')
  .patch(authController.protect, authController.updateProfilePic);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, authController.updateUser)
  .delete(authController.protect, userController.deleteUser);

router
  .route('/:id/posts')
  .get(authController.protect, postController.getAllPostsByUser);

module.exports = router;
