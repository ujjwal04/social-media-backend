const sequelize = require('sequelize');
const db = require('./../database');
const like = require('./likeModel');
const comment = require('./commentModel');
const user = require('./userModel');

const commentLike = db.define('comment_like', {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comment_id: {
    type: sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: comment,
      key: 'id',
    },
  },
  user_id: {
    type: sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: user,
      key: 'id',
    },
  },
});

// commentLike.belongsTo(user, {
//   foreignKey: 'user_id',
//   onDelete: 'cascade',
// });
// commentLike.belongsTo(comment, {
//   foreignKey: 'comment_id',
//   onDelete: 'cascade',
//   primaryKey: true,
// });

// like.belongsToMany(comment, { through: commentLike, foreignKey: 'like_id' });

// comment.belongsToMany(like, {
//   through: commentLike,
//   foreignKey: 'comment_id',
// });

module.exports = commentLike;
