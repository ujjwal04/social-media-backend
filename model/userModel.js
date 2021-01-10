const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('./../database');
const reply = require('./replyModel');
const post = require('./postModel');
const comment = require('./commentModel');

const user = db.define(
  'user',
  {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_name: {
      type: sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'please give a valid username' },
      },
    },
    name: {
      type: sequelize.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: 'please give a valid name' },
      },
    },
    email: {
      type: sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'please give a valid email' },
      },
    },
    bio: {
      type: sequelize.STRING(100),
      allowNull: true,
    },
    profile_pic: {
      type: sequelize.STRING(150),
      allowNull: true,
    },
    password: {
      type: sequelize.STRING(100),
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
post.belongsTo(user, {
  foreignKey: 'user_id',
});

user.hasMany(comment, {
  as: 'user_id',
  foreignKey: 'user_id',
  onDelete: 'cascade',
});
comment.belongsTo(user, {
  foreignKey: 'user_id',
});

user.hasMany(reply, {
  foreignKey: 'user_id',
  onDelete: 'cascade',
});
reply.belongsTo(user, {
  foreignKey: 'user_id',
});

user.addHook('beforeCreate', async (user, options) => {
  // Only run this function if password was actually modified
  if (!user.changed().includes('password')) {
    return;
  }

  // Hash the password with the cost of 12
  user.password = await bcrypt.hash(user.password, 12);
});

user.addHook('beforeUpdate', async (user, options) => {
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
