const sequelize = require('sequelize');
const db = require('./../database');
const reply = require('./replyModel');

const comment = db.define('comment', {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  timestamp: {
    type: sequelize.TIME,
    allowNull: false,
  },
  type: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid type' },
    },
  },
  content: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid comment' },
    },
  },
});

comment.hasMany(reply, { foreignKey: 'comment_id' });

module.exports = comment;
