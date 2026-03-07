import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { requireAuth, type AuthedRequest } from '../../common/middleware.js';
import { enqueueCoverJob, enqueueImageJob } from '../../services/queue/queues.js';

const imageSchema = z.object({
  prompt: z.string().min(10),
  size: z.enum(['1024x1024', '1536x1024', '1024x1536']).optional()
});

export const imagesRouter = Router();
imagesRouter.use(requireAuth);

imagesRouter.post('/books/:bookId/images/generate', async (req: AuthedRequest, res, next) => {
  try {
    const input = imageSchema.parse(req.body);
    const book = await prisma.book.findFirst({
      where: { id: req.params.bookId, organizationId: req.auth!.organizationId }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const queued = await prisma.aiJob.create({
      data: {
        organizationId: req.auth!.organizationId,
        type: 'image_generation',
        status: 'QUEUED',
        inputJson: { bookId: book.id, ...input },
        progress: 0
      }
    });

    await enqueueImageJob({ aiJobId: queued.id, bookId: book.id, prompt: input.prompt, size: input.size });

    res.status(202).json({ jobId: queued.id, status: queued.status });
  } catch (err) {
    next(err);
  }
});

imagesRouter.post('/books/:bookId/covers/generate', async (req: AuthedRequest, res, next) => {
  try {
    const input = imageSchema.parse(req.body);
    const book = await prisma.book.findFirst({
      where: { id: req.params.bookId, organizationId: req.auth!.organizationId }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const coverPrompt = `Professional front book cover for titled "${book.title}". ${input.prompt}`;

    const queued = await prisma.aiJob.create({
      data: {
        organizationId: req.auth!.organizationId,
        type: 'cover_generation',
        status: 'QUEUED',
        inputJson: { bookId: book.id, coverPrompt, size: input.size },
        progress: 0
      }
    });

    await enqueueCoverJob({ aiJobId: queued.id, bookId: book.id, prompt: coverPrompt, size: input.size });

    res.status(202).json({ jobId: queued.id, status: queued.status });
  } catch (err) {
    next(err);
  }
});
