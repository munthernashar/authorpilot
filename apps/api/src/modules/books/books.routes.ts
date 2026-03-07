import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { requireAuth, type AuthedRequest } from '../../common/middleware.js';
import { bookAiService } from '../../services/ai/book-ai.service.js';
import { enqueueOutlineJob } from '../../services/queue/queues.js';

const createBookSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  language: z.string().default('en'),
  personaId: z.string().optional(),
  targetWordCount: z.number().int().positive().optional()
});

const titleGenerateSchema = z.object({
  description: z.string().min(10),
  audience: z.string().min(2),
  language: z.string().default('en')
});

const outlineGenerateSchema = z.object({
  targetChapters: z.number().int().min(3).max(30).default(10)
});

export const booksRouter = Router();
booksRouter.use(requireAuth);

booksRouter.post('/', async (req: AuthedRequest, res, next) => {
  try {
    const input = createBookSchema.parse(req.body);
    const book = await prisma.book.create({
      data: {
        ...input,
        organizationId: req.auth!.organizationId,
        createdBy: req.auth!.userId
      }
    });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

booksRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const books = await prisma.book.findMany({
      where: { organizationId: req.auth!.organizationId },
      include: { chapters: { orderBy: { position: 'asc' } } },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(books);
  } catch (err) {
    next(err);
  }
});

booksRouter.post('/:bookId/title/generate', async (req: AuthedRequest, res, next) => {
  try {
    const book = await prisma.book.findFirst({
      where: { id: req.params.bookId, organizationId: req.auth!.organizationId }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const input = titleGenerateSchema.parse(req.body);
    const titles = await bookAiService.generateTitles({
      description: input.description,
      audience: input.audience,
      language: input.language
    });

    return res.json({ titles });
  } catch (err) {
    next(err);
  }
});

booksRouter.post('/:bookId/outline/generate', async (req: AuthedRequest, res, next) => {
  try {
    const book = await prisma.book.findFirst({
      where: { id: req.params.bookId, organizationId: req.auth!.organizationId }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const input = outlineGenerateSchema.parse(req.body);

    const queued = await prisma.aiJob.create({
      data: {
        organizationId: req.auth!.organizationId,
        type: 'outline_generation',
        status: 'QUEUED',
        inputJson: { bookId: book.id, targetChapters: input.targetChapters },
        progress: 0
      }
    });

    await enqueueOutlineJob({
      aiJobId: queued.id,
      bookId: book.id,
      targetChapters: input.targetChapters
    });

    res.status(202).json({ jobId: queued.id, status: queued.status });
  } catch (err) {
    next(err);
  }
});

