import Redis from "ioredis";
import { config } from "./../config/config";

const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  username: "default"
});

const setRedisValueByKey = async (key, value) => {
  //   await redisClient.connect();
  const res = await redis.set(key, value);
  return res;
};

const setRedisValueByKeyWithExpireSec = async (key, value, sec) => {
  //   await redisClient.connect();
  const res = await redis.set(key, value, "EX", sec);
  return res;
};

const getRedisValueByKey = async key => {
  const value = await redis.get(key);
  return value;
};

export {
  setRedisValueByKey,
  setRedisValueByKeyWithExpireSec,
  getRedisValueByKey
};
