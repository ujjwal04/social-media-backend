const sequelize = require('sequelize');
const db = require('./../database');
const post = require('./postModel');

const catchAsync = require('./../utils/catchAsync');

const comment = db.define('commentOnPost', {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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

post.hasMany(comment, {
  foreignKey: 'post_id',
  onDelete: 'cascade',
});
comment.belongsTo(post, {
  foreignKey: 'post_id',
});

// user.hasMany(comment, {
//   foreignKey: 'user_id',
//   onDelete: 'cascade',
// });
// comment.belongsTo(user, {
//   foreignKey: 'post_id',
// });

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
