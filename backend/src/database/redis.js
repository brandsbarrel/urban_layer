import { createClient } from "redis";
import { env, logger } from "../config/index.js";

const redisClient = createClient({
  url: env.REDIS_URL
});

redisClient.on("error", (error) => {
  logger.error({ error }, "Redis client error.");
});

const connectRedis = async () => {
  if (redisClient.isOpen) {
    return redisClient;
  }

  await redisClient.connect();
  logger.info("Redis connection established.");
  return redisClient;
};

const disconnectRedis = async () => {
  if (!redisClient.isOpen) {
    return;
  }

  await redisClient.quit();
  logger.info("Redis connection closed.");
};

export { connectRedis, disconnectRedis, redisClient };
