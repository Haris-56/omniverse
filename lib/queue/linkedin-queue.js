import { Queue } from 'bullmq';
import { redisConnection } from './redis.js';

const linkedinQueue = new Queue('linkedin-automation', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: 3600, // keep failures for an hour for debugging
  }
});

async function addLinkedinJob(name, data, options = {}) {
  await linkedinQueue.add(name, data, options);
}

export { linkedinQueue, addLinkedinJob };
