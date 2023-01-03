import Redis from "ioredis";
import { config } from "./../config/config";

const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  username: "default"
});

const setRedisValueByKey = async (key, value) => {
  return await redis.set(key, value);
};

const setRedisValueByKeyWithExpireSec = async (key, value, sec) => {
  return await redis.set(key, value, "EX", sec);
};

const getRedisValueByKey = async key => {
  return await redis.get(key);
};

export {
  setRedisValueByKey,
  setRedisValueByKeyWithExpireSec,
  getRedisValueByKey
};
