import Bull from 'bull';
import { runLighthouse } from './lighthouseWorker.js';
import { sockets } from './server.js';
import ws from 'ws';

const lighthouseQueue = new Bull('lighthouse', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

lighthouseQueue.process(async (job) => {
  const { url, jobId } = job.data;
  await runLighthouse(url, jobId);
});

lighthouseQueue.on('completed', async (job, result) => {
  const jobId = job.id;
  const socket = sockets.get(jobId);

  if (socket && socket.readyState === ws.OPEN) {
    socket.send(JSON.stringify({ type: 'report', url: `/report/${jobId}` }));
  }

  // Remove the socket from the Map once the job is completed
  sockets.delete(jobId);
});


export default lighthouseQueue;
