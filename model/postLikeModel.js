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

post.hasMany(postLike, { foreignKey: 'post_id', onDelete: 'cascade' });
postLike.belongsTo(post, {
  foreignKey: 'post_id',
});

postLike.addHook(
  'afterCreate',
  catchAsync(async (postLike, options) => {
    await post.increment(['likes'], {
      by: 1,
      where: {
        id: postLike.post_id,
      },
    });
  })
);

postLike.addHook(
  'afterDestroy',
  catchAsync(async (postLike, options) => {
    await post.decrement(['likes'], {
      by: 1,
      where: {
        id: postLike.post_id,
      },
    });
  })
);

module.exports = postLike;
