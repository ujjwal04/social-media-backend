const { promisify } = require('util');
const jwt = require('jsonwebtoken');
//const admin = require('./../utils/firebase');
const User = require('../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user.id,
        user_name: user.user_name,
        profile_pic: user.profile_pic,
        createdAt: user.createdAt,
      },
    },
  });
};

// const saveProfilePicInFirebase = async (blob, next) => {
//   try {
//     // console.log('idhar aya');
//     // const ref = await firebase.storage().ref('users').child('pic1').put(blob);
//     // // .put(blob);
//     // console.log(ref);
//     // const downloadUrl = await firebase
//     //   .storage()
//     //   .ref('/users')
//     //   .child('pic1')
//     //   .getDownloadURL();
//     // return downloadUrl;
//     console.log('asdas');
//     const bucket = await admin.storage().bucket();
//     console.log(bucket);
//     bucket.upload(blob);
//     console.log('idhar aya');
//     return 'asdsad';
//   } catch (err) {}
// };

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    user_name: req.body.user_name,
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio ? req.body.bio : null,
    profile_pic: req.body.profile_pic ? req.body.profile_pic : null,
    password: req.body.password,
    passwordChangedAt: req.body.passwordChangedAt
      ? req.body.passwordChangedAt
      : null,
  });

  const token = signToken(newUser.id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: newUser.id,
        user_name: newUser.user_name,
        name: newUser.name,
        profile_pic: newUser.profile_pic,
        email: newUser.email,
        bio: newUser.bio,
        createdAt: newUser.createdAt,
      },
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { user_name, password } = req.body;

  // 1) Check if user_name and password exist
  if (!user_name || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({
    attributes: {
      include: ['password'],
    },
    where: {
      user_name,
    },
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  // 3) If everything ok,send token to client
  const token = signToken(user.id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user.id,
        user_name: user.user_name,
        name: user.name,
        profile_pic: user.profile_pic,
        createdAt: user.createdAt,
        bio: user.bio,
        email: user.email,
      },
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from db
  const user = await User.findOne({
    attributes: {
      include: ['password'],
    },
    where: {
      id: req.user.id,
    },
  });

  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  if (req.body.password !== req.body.passwordConfirm)
    return next(new AppError('Passwords are not matching', 401));

  // User.findById(req.user.id)
  // .then(function(instance) {
  //   await instance.update(
  //     {
  //       password: req.body.password,
  //       passwordChangedAt: Date.now(),
  //     },
  //     {
  //       where: {
  //         id: req.user.id,
  //       },
  //     },
  //   );
  // })

  await user.update(
    {
      password: req.body.password,
      passwordChangedAt: Date.now(),
    },
    {
      where: {
        id: req.user.id,
      },
      individualHooks: true,
    }
  );
  createSendToken(user, 200, res);
});

// exports.updateUser = catchAsync(async (req, res, next) => {
//   // 1) Create error if user posts password data
//   if (req.body.password || req.body.passwordConfirm)
//     return next(new AppError('This route is not for updating password', 400));

//   // 2) Check for the existing user in db
//   const updatedUser = await User.findOne({
//     attributes: {
//       include: ['password'],
//     },
//     where: {
//       id: req.user.id,
//     },
//   });

//   await updatedUser.update(req.body, {
//     where: {
//       id: req.user.id,
//     },
//     hooks: false,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedUser,
//     },
//   });
// });

exports.updateProfilePic = catchAsync(async (req, res, next) => {
  if (!req.body.profile_pic)
    return next(new AppError('Please provide a profile pic', 400));
  const updatedUser = await User.findOne({
    where: {
      id: req.user.id,
    },
  });

  // const uploadedImageUrl = await saveProfilePicInFirebase(
  //   req.body.profile_pic,
  //   next
  // );

  await updatedUser.update(
    { profile_pic: req.body.profile_pic },
    {
      where: {
        id: req.user.id,
      },
      hooks: false,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const freshUser = await User.findOne({
    attributes: {
      include: ['password'],
    },
    where: {
      id: decoded.id,
    },
  });
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed passwords after the JWT was issued
  // freshUser.changedPasswordAfter(decoded.iat);

  // GRANT ACCESS
  req.user = freshUser;
  next();
});
