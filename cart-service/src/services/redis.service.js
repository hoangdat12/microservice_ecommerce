import { EXP_TIME_CART } from '../constant/redis.constant.js';
import client from '../dbs/init.redis.js';

export class RedisService {
  static async hset({ key, field, value }) {
    return await client
      .multi()
      .hset(key, field, value)
      .expire(key, EXP_TIME_CART)
      .exec();
  }

  static async hincrby({ key, field, incre }) {
    return await client.hincrby(key, field, incre);
  }

  static async hdel({ key, field }) {
    return await client.hdel(key, field);
  }

  static async hget({ key, field }) {
    return await client.hget(key, field);
  }

  static async hgetall({ key }) {
    return await client.hgetall(key);
  }
}
