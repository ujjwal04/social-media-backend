const sequelize = require('sequelize');
const db = require('./../database');

const reply = db.define('reply', {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  timestamp: {
    type: sequelize.TIME,
    allowNull: false,
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
