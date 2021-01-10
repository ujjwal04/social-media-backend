const sequelize = require('sequelize');

const db = new sequelize({
  dialect: 'mysql',
  database: process.env.db,
  host: process.env.host,
  username: process.env.user,
  password: process.env.password,
  define: { charset: 'utf8mb4', dialectOptions: { collate: 'utf8mb4_bin' } },
});

db.sync()
  .then(() => {
    console.log('DB connection successful!!');
  })
  .catch((err) => console.log(err));

module.exports = db;
