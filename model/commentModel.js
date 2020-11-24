const sequelize = require('sequelize');
const db = require('./../database');
const post = require('./postModel');

const catchAsync = require('./../utils/catchAsync');

const comment = db.define('comment', {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  post_id: {
    type: sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: post,
      key: 'id',
    },
  },
  likes: {
    type: sequelize.INTEGER,
    defaultValue: 0,
  },
  replies: {
    type: sequelize.INTEGER,
    defaultValue: 0,
  },
  content: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid comment' },
    },
  },
});

comment.addHook(
  'afterCreate',
  catchAsync(async (comment, options) => {
    await post.increment(['comments'], {
      by: 1,
      where: {
        id: comment.post_id,
      },
    });
  })
);

module.exports = comment;
