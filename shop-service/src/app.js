import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import ServerGRPC from './grpc/server.grpc.js';
import shopRoute from '../src/route/shop.route.js';
import { AppDataSource } from './dbs/data-source.js';

const app = express();

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
app.use(
  cors({
    origin: 'http://localhost:8081', // Replace with your allowed origin
  })
);

// ROUTE
app.use('/api/v1/shop', shopRoute);

// CONNECT
// 1. DATABASE
AppDataSource.initialize()
  .then(async () => {
    console.log('Psql connected');
  })
  .catch((err) => console.log(err));

// gRPC
const serverGRPC = new ServerGRPC();
serverGRPC.onServer();

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
