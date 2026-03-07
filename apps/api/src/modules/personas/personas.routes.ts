import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { requireAuth, type AuthedRequest } from '../../common/middleware.js';

const personaSchema = z.object({
  name: z.string().min(2),
  tone: z.string().min(2),
  audience: z.string().min(2),
  genre: z.string().min(2),
  constraintsJson: z.record(z.any()).optional()
});

export const personasRouter = Router();
personasRouter.use(requireAuth);

personasRouter.post('/', async (req: AuthedRequest, res, next) => {
  try {
    const data = personaSchema.parse(req.body);
    const persona = await prisma.authorPersona.create({
      data: { ...data, organizationId: req.auth!.organizationId }
    });
    res.status(201).json(persona);
  } catch (err) {
    next(err);
  }
});

personasRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const rows = await prisma.authorPersona.findMany({ where: { organizationId: req.auth!.organizationId } });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});
