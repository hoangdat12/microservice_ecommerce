import Redis from 'ioredis';

// const client = new Redis({
//   port: 6379, // Redis port
//   host: '127.0.0.1', // Redis host
//   username: 'default', // needs Redis >= 6
//   password: 'my-top-secret',
//   db: 0, // Defaults to 0
// });

export class RedisDB {
  static instance;
  client;

  constructor() {
    this.connect();
  }

  connect() {
    this.client = new Redis({
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
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
