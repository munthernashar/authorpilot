import { Router } from 'express';
import { prisma } from '../../config/prisma.js';
import { requireAuth, type AuthedRequest } from '../../common/middleware.js';

export const jobsRouter = Router();
jobsRouter.use(requireAuth);

jobsRouter.get('/:jobId', async (req: AuthedRequest, res, next) => {
  try {
    const job = await prisma.aiJob.findFirst({
      where: {
        id: req.params.jobId,
        organizationId: req.auth!.organizationId
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
});
