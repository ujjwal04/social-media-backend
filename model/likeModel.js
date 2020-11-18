const sequelize = require('sequelize');
const db = require('./../database');

const like = db.define('like', {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  emoji: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid emoji' },
    },
  },
  type: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid type' },
    },
  },
});

module.exports = like;
