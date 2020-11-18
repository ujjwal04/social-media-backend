const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const user = require('./model/userModel');
const comment = require('./model/commentModel');
const post = require('./model/postModel');
const commentLike = require('./model/commentLikeModel');
const postLike = require('./model/postLikeModel');
const reply = require('./model/replyModel');
const like = require('./model/likeModel');

const port = process.env.port || 3000;
const server = app.listen(port, '0.0.0.0', () =>
  console.log(`Listening to port ${port}`)
);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
