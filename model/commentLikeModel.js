const sequelize = require('sequelize');
const db = require('./../database');
const like = require('./likeModel');
const comment = require('./commentModel');

const commentLike = db.define('comment_like');

like.belongsToMany(comment, { through: commentLike, foreignKey: 'like_id' });

comment.belongsToMany(like, {
  through: commentLike,
  foreignKey: 'comment_id',
});

module.exports = commentLike;
