import { Router } from 'express';
import { prisma } from '../../config/prisma.js';
import { requireAuth, type AuthedRequest } from '../../common/middleware.js';

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

dashboardRouter.get('/summary', async (req: AuthedRequest, res, next) => {
  try {
    const organizationId = req.auth!.organizationId;

    const [books, personas, queuedJobs, runningJobs] = await Promise.all([
      prisma.book.count({ where: { organizationId } }),
      prisma.authorPersona.count({ where: { organizationId } }),
      prisma.aiJob.count({ where: { organizationId, status: 'QUEUED' } }),
      prisma.aiJob.count({ where: { organizationId, status: 'RUNNING' } })
    ]);

    const chapterAgg = await prisma.chapter.aggregate({
      _count: { id: true },
      where: { book: { organizationId } }
    });

    return res.json({
      books,
      chapters: chapterAgg._count.id,
      personas,
      queuedJobs,
      runningJobs
    });
  } catch (err) {
    next(err);
  }
});
