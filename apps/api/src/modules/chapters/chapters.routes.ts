import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { requireAuth, type AuthedRequest } from '../../common/middleware.js';
import { bookAiService } from '../../services/ai/book-ai.service.js';
import { enqueueChapterContinueJob } from '../../services/queue/queues.js';

const createChapterSchema = z.object({
  title: z.string().min(2),
  position: z.number().int().positive(),
  targetWords: z.number().int().positive().optional()
});

const updateContentSchema = z.object({
  content: z.string().min(1)
});

const continueSchema = z.object({
  styleGuide: z.string().default('clear, engaging, and non-repetitive'),
  maxWords: z.number().int().min(100).max(2000).default(700)
});

const rewriteSchema = z.object({
  selection: z.string().min(20),
  instruction: z.string().min(3)
});

const expandSchema = z.object({
  selection: z.string().min(20),
  focus: z.string().min(3)
});

export const chaptersRouter = Router();
chaptersRouter.use(requireAuth);

chaptersRouter.post('/books/:bookId/chapters', async (req: AuthedRequest, res, next) => {
  try {
    const book = await prisma.book.findFirst({
      where: { id: req.params.bookId, organizationId: req.auth!.organizationId }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const input = createChapterSchema.parse(req.body);
    const chapter = await prisma.chapter.create({
      data: { ...input, bookId: book.id }
    });

    res.status(201).json(chapter);
  } catch (err) {
    next(err);
  }
});

chaptersRouter.patch('/chapters/:chapterId/content', async (req: AuthedRequest, res, next) => {
  try {
    const input = updateContentSchema.parse(req.body);

    const chapter = await prisma.chapter.findFirst({
      where: {
        id: req.params.chapterId,
        book: { organizationId: req.auth!.organizationId }
      }
    });

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    const updated = await prisma.chapter.update({
      where: { id: chapter.id },
      data: { content: input.content }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

chaptersRouter.post('/chapters/:chapterId/ai/continue', async (req: AuthedRequest, res, next) => {
  try {
    const input = continueSchema.parse(req.body ?? {});

    const chapter = await prisma.chapter.findFirst({
      where: {
        id: req.params.chapterId,
        book: { organizationId: req.auth!.organizationId }
      }
    });

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    const queued = await prisma.aiJob.create({
      data: {
        organizationId: req.auth!.organizationId,
        type: 'chapter_continue',
        status: 'QUEUED',
        inputJson: {
          chapterId: chapter.id,
          styleGuide: input.styleGuide,
          maxWords: input.maxWords
        },
        progress: 0
      }
    });

    await enqueueChapterContinueJob({
      aiJobId: queued.id,
      chapterId: chapter.id,
      styleGuide: input.styleGuide,
      maxWords: input.maxWords
    });

    res.status(202).json({ jobId: queued.id, status: queued.status });
  } catch (err) {
    next(err);
  }
});

chaptersRouter.post('/chapters/:chapterId/ai/rewrite', async (req: AuthedRequest, res, next) => {
  try {
    const input = rewriteSchema.parse(req.body);

    const chapter = await prisma.chapter.findFirst({
      where: {
        id: req.params.chapterId,
        book: { organizationId: req.auth!.organizationId }
      }
    });

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    const rewritten = await bookAiService.rewriteSelection({
      selection: input.selection,
      instruction: input.instruction
    });

    res.json({ rewritten });
  } catch (err) {
    next(err);
  }
});

chaptersRouter.post('/chapters/:chapterId/ai/expand', async (req: AuthedRequest, res, next) => {
  try {
    const input = expandSchema.parse(req.body);

    const chapter = await prisma.chapter.findFirst({
      where: {
        id: req.params.chapterId,
        book: { organizationId: req.auth!.organizationId }
      }
    });

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    const expanded = await bookAiService.expandSelection({
      selection: input.selection,
      focus: input.focus
    });

    res.json({ expanded });
  } catch (err) {
    next(err);
  }
});
