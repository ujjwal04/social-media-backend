const sequelize = require('sequelize');
const db = require('./../database');
const user = require('./userModel');
const comment = require('./commentModel');

const reply = db.define('reply', {
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
  content: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid comment' },
    },
  },
});

module.exports = reply;
