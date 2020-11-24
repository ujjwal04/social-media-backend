const sequelize = require('sequelize');
const db = require('./../database');
const post = require('./postModel');
const user = require('./userModel');

const postLike = db.define('post_like', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  post_id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    onDelete: 'CASCADE',
    references: {
      model: post,
      key: 'id',
    },
  },
  user_id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    onDelete: 'CASCADE',
    references: {
      model: user,
      key: 'id',
    },
  },
});

postLike.addHook(
  'afterCreate',
  catchAsync(async (commentLike, options) => {
    await post.increment(['likes'], {
      by: 1,
      where: {
        id: commentLike.post_id,
      },
    });
  })
);

module.exports = postLike;
