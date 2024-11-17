import Redis from "ioredis";

const port = process.env?.REDIS_PORT || "6379";
const host = process.env.REDIS_HOST || "127.0.0.1";
const redisClient = new Redis({
  enableOfflineQueue: false,
  port: parseInt(port),
  host: host,
});

export const setRedisValue = async (
  key: string,
  value: string,
  ttl?: number
) => {
  try {
    if (ttl) {
      await redisClient.set(key, value, "EX", ttl); // 'EX' sets expiration in seconds
    } else {
      await redisClient.set(key, value);
    }
    console.log(`Key "${key}" set successfully.`);
  } catch (error) {
    console.error("Error setting value in Redis:", error);
  }
};

export const getRedisValue = async (key: string): Promise<string | null> => {
  try {
    const value = await redisClient.get(key);

    return value;
  } catch (error) {
    console.error("Error fetching value from Redis:", error);
    return null;
  }
};

export const deleteRedisKey = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
    console.log(`Key "${key}" deleted successfully.`);
  } catch (error) {
    console.error("Error deleting key from Redis:", error);
  }
};
