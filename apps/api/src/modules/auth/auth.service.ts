import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { HttpError } from '../../common/http-error.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../common/auth.js';
import { env } from '../../config/env.js';

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const register = async (input: {
  email: string;
  password: string;
  fullName: string;
  organizationName: string;
}) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new HttpError(409, 'Email already exists');

  const passwordHash = await bcrypt.hash(input.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: input.email, passwordHash, fullName: input.fullName }
    });

    const org = await tx.organization.create({
      data: {
        name: input.organizationName,
        slug: `${slugify(input.organizationName)}-${Math.floor(Math.random() * 10000)}`,
        ownerUserId: user.id
      }
    });

    await tx.organizationMember.create({
      data: { organizationId: org.id, userId: user.id, role: 'OWNER' }
    });

    return { user, org };
  });

  const accessToken = signAccessToken({
    userId: result.user.id,
    organizationId: result.org.id,
    role: 'OWNER'
  });

  const refreshToken = signRefreshToken({ userId: result.user.id });
  await prisma.refreshToken.create({
    data: {
      userId: result.user.id,
      tokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)
    }
  });

  return {
    accessToken,
    refreshToken,
    user: { id: result.user.id, email: result.user.email, fullName: result.user.fullName },
    organization: { id: result.org.id, name: result.org.name }
  };
};

export const login = async (input: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new HttpError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new HttpError(401, 'Invalid credentials');

  const membership = await prisma.organizationMember.findFirst({ where: { userId: user.id } });
  if (!membership) throw new HttpError(403, 'User is not assigned to any organization');

  const accessToken = signAccessToken({
    userId: user.id,
    organizationId: membership.organizationId,
    role: membership.role
  });

  const refreshToken = signRefreshToken({ userId: user.id });
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)
    }
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, fullName: user.fullName },
    organizationId: membership.organizationId,
    role: membership.role
  };
};

export const refresh = async (token: string) => {
  const payload = verifyRefreshToken(token);
  const validTokens = await prisma.refreshToken.findMany({
    where: { userId: payload.userId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const matches = await Promise.all(validTokens.map((row) => bcrypt.compare(token, row.tokenHash)));
  if (!matches.some(Boolean)) throw new HttpError(401, 'Invalid refresh token');

  const membership = await prisma.organizationMember.findFirst({ where: { userId: payload.userId } });
  if (!membership) throw new HttpError(403, 'No active membership');

  const accessToken = signAccessToken({
    userId: payload.userId,
    organizationId: membership.organizationId,
    role: membership.role
  });

  return { accessToken };
};
