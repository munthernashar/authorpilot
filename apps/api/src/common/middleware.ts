import type { NextFunction, Request, Response } from 'express';
import { HttpError } from './http-error.js';
import { verifyAccessToken } from './auth.js';

export type AuthedRequest = Request & {
  auth?: {
    userId: string;
    organizationId: string;
    role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  };
};

export const requireAuth = (req: AuthedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing bearer token'));
  }

  const token = header.slice(7);
  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
};

export const requireRole = (roles: Array<'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER'>) =>
  (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(new HttpError(403, 'Insufficient permissions'));
    }

    next();
  };

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal server error' });
};
