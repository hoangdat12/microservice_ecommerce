import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import ServerGRPC from './gRPC/server.gRPC.js';
import Database from './dbs/init.mongodb.js';
import cartRoute from './routes/cart.route.js';
import Consumer from './rabbitMQ/comsumer.js';
import { RedisDB } from './dbs/init.redis.js';

const app = express();

// CONNECT
Database.getInstance('mongodb');
RedisDB.getInstance();

const serverGRPC = new ServerGRPC();
serverGRPC.onServer();

// MIDDLEWARE
app.use(morgan('dev'));
app.use(helmet());
// Giam bang thong
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

function parseJSON(req, res, next) {
  if (req.headers.user) {
    try {
      req.user = JSON.parse(req.headers.user);
    } catch (err) {
      return next(new Error('Invalid JSON in user header'));
    }
  }
  next();
}
app.use(parseJSON);

// RabbitMQ
// const consumer = new Consumer();
// await consumer.receivedMessage();

// ROUTE
app.use('/api/v1/cart', cartRoute);

app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: err.message || 'Internal Server Error!',
  });
});

export default app;
