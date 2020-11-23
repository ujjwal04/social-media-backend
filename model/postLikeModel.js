const sequelize = require('sequelize');
const db = require('./../database');
const like = require('./likeModel');
const post = require('./postModel');

const postLike = db.define('post_like', {});

like.belongsToMany(post, { through: postLike, foreignKey: 'like_id' });

post.belongsToMany(like, {
  through: postLike,
  foreignKey: 'post_id',
});

module.exports = postLike;
