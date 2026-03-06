
import { Queue } from 'bullmq';
import { redisConnection } from './redis.js';

const emailQueue = new Queue('email-sending', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  }
});

async function addEmailJob(data) {
  await emailQueue.add('send-email', data);
}

export { emailQueue, addEmailJob };
