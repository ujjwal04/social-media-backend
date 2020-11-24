const sequelize = require('sequelize');
const db = require('./../database');
const like = require('./likeModel');
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

module.exports = postLike;
