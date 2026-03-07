import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import { handleOutlineJob } from '../handlers/outline.handler.js';
import { handleChapterContinueJob } from '../handlers/chapter.handler.js';
import { handleImageJob } from '../handlers/image.handler.js';
import { prisma } from '../config/prisma.js';

const connection = { host: env.REDIS_HOST, port: env.REDIS_PORT };

const withFailureHandling = <T>(handler: (payload: T) => Promise<void>) => async (job: { data: T }) => {
  try {
    await handler(job.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown worker error';
    const payload = job.data as { aiJobId?: string };
    if (payload.aiJobId) {
      await prisma.aiJob.update({
        where: { id: payload.aiJobId },
        data: { status: 'FAILED', errorMessage: message }
      });
    }
    throw error;
  }
};

export const outlineWorker = new Worker('outline-generation', withFailureHandling(handleOutlineJob), { connection });
export const chapterWorker = new Worker('chapter-generation', withFailureHandling(handleChapterContinueJob), {
  connection
});
export const imageWorker = new Worker(
  'image-generation',
  withFailureHandling((data: { aiJobId: string; bookId: string; prompt: string; size?: '1024x1024' | '1536x1024' | '1024x1536' }) =>
    handleImageJob(data, 'image_generation')),
  { connection }
);
export const coverWorker = new Worker(
  'cover-generation',
  withFailureHandling((data: { aiJobId: string; bookId: string; prompt: string; size?: '1024x1024' | '1536x1024' | '1024x1536' }) =>
    handleImageJob(data, 'cover_generation')),
  { connection }
);

const workers = [outlineWorker, chapterWorker, imageWorker, coverWorker];

for (const worker of workers) {
  worker.on('completed', (job) => {
    console.log(`[worker:${worker.name}] completed job ${job?.id}`);
  });

  worker.on('failed', (job, error) => {
    console.error(`[worker:${worker.name}] failed job ${job?.id}: ${error.message}`);
  });
}

export const closeWorkers = async () => {
  await Promise.all(workers.map((worker) => worker.close()));
};
