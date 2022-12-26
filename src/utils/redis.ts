import Redis from "ioredis";
// import { createClient } from "redis";

// const redisClient = createClient({
//   url: "redis://conan-kim:conankim1234@3.36.119.86:6379",
//   legacyMode: true
// });
// redisClient.on("error", error => console.log(`Error on Redis: ${error}`));

const redis = new Redis();

const setKey = async (key, value) => {
  //   await redisClient.connect();
  const res = await redis.set(key, value);
  console.log(res);
  return res;
};

const getKey = async key => {
  //   await redisClient.connect();
  const value = await redis.get(key);
  console.log(value);
  return value;
};

export { setKey, getKey };
