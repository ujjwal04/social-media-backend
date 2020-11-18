const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('./../database');
const reply = require('./replyModel');
const post = require('./postModel');
const comment = require('./commentModel');

const user = db.define(
  'user',
  {
    user_name: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'please give a valid username' },
      },
    },
    name: {
      type: sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'please give a valid name' },
      },
    },
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profile_pic: {
      type: sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide your password',
        },
      },
    },
    passwordChangedAt: { type: sequelize.DATE, allowNull: true },
  },
  {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  }
);

user.hasMany(post, { foreignKey: 'user_id', onDelete: 'cascade' });
user.hasMany(comment, { foreignKey: 'user_id', onDelete: 'cascade' });
user.hasMany(reply, { foreignKey: 'user_id', onDelete: 'cascade' });

user.addHook('beforeCreate', async (user, options) => {
  // Only run this function if password was actually modified
  if (!user.changed().includes('password')) {
    return;
  }

  // Hash the password with the cost of 12
  user.password = await bcrypt.hash(user.password, 12);
});

user.prototype.correctPassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

user.prototype.changedPasswordAfter = (JWTTimestamp) => {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt, JWTTimestamp);
  }

  return false;
};

module.exports = user;
