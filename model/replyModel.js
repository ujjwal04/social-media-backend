const sequelize = require('sequelize');
const db = require('./../database');
const user = require('./userModel');
const comment = require('./commentModel');

const reply = db.define('replyOnComment', {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid comment' },
    },
  },
});

comment.hasMany(reply, {
  foreignKey: 'comment_id',
  onDelete: 'cascade',
});
reply.belongsTo(comment, {
  foreignKey: 'comment_id',
});

reply.addHook(
  'afterCreate',
  catchAsync(async (reply, options) => {
    await comment.increment(['replies'], {
      by: 1,
      where: {
        id: reply.comment_id,
      },
    });
  })
);

module.exports = reply;
