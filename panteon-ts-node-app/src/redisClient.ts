import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
});

redisClient.on('error', (error) => console.error('Redis Client Error', error));

export default redisClient;
