import { Router } from 'express';
import { loginSchema, registerSchema } from './auth.schema.js';
import { login, refresh, register } from './auth.service.js';
import { HttpError } from '../../common/http-error.js';
import { requireAuth, type AuthedRequest } from '../../common/middleware.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await register(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await login(input);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const token = req.body?.refreshToken;
    if (!token) throw new HttpError(400, 'refreshToken is required');
    const result = await refresh(token);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  res.json({ auth: req.auth });
});
