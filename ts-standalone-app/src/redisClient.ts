// src/redisClient.ts

import Redis from 'ioredis';
import config from './config.js';
import logger from './logger.js'; 


const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,

});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis.');
});

export default redisClient;
