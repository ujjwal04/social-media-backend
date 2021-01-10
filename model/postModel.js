const sequelize = require('sequelize');
const db = require('./../database');

const comment = require('./commentModel');

const post = db.define('post', {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid password' },
    },
  },
  image: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid password' },
    },
  },
  likes: {
    type: sequelize.INTEGER,
    defaultValue: 0,
  },
  comments: {
    type: sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = post;
