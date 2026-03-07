import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AuthPayload = {
  userId: string;
  organizationId: string;
  role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
};

export const signAccessToken = (payload: AuthPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });

export const signRefreshToken = (payload: Pick<AuthPayload, 'userId'>) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as Pick<AuthPayload, 'userId'>;
