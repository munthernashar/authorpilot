import { Queue } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379)
};

export const queues = {
  outline: new Queue('outline-generation', { connection }),
  chapter: new Queue('chapter-generation', { connection }),
  image: new Queue('image-generation', { connection }),
  cover: new Queue('cover-generation', { connection })
};

export const enqueueOutlineJob = async (payload: { aiJobId: string; bookId: string; targetChapters: number }) =>
  queues.outline.add('outline-generate', payload, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });

export const enqueueChapterContinueJob = async (payload: {
  aiJobId: string;
  chapterId: string;
  styleGuide: string;
  maxWords: number;
}) => queues.chapter.add('chapter-continue', payload, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });

export const enqueueImageJob = async (payload: { aiJobId: string; bookId: string; prompt: string; size?: string }) =>
  queues.image.add('image-generate', payload, { attempts: 2, backoff: { type: 'fixed', delay: 1500 } });

export const enqueueCoverJob = async (payload: { aiJobId: string; bookId: string; prompt: string; size?: string }) =>
  queues.cover.add('cover-generate', payload, { attempts: 2, backoff: { type: 'fixed', delay: 1500 } });
