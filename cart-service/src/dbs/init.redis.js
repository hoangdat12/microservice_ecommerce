import Redis from 'ioredis';

export class RedisDB {
  static instance;
  client;

  constructor() {
    this.connect();
  }

  connect() {
    this.client = new Redis({
      port: parseInt(process.env.REDIS_PORT), // Redis port
      host: process.env.REDIS_HOST, // Redis host
    });
  }

  static getInstance() {
    if (!RedisDB.instance) {
      RedisDB.instance = new RedisDB();
    }
    return RedisDB.instance;
  }
}

const instance = RedisDB.getInstance();
const client = instance.client;

export default client;
