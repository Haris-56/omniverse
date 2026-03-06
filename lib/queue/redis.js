
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
console.log(`Connecting to Redis at: ${REDIS_URL.split('@').pop()}`); // Log only host:port for safety

const redisConnection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

export { redisConnection };
