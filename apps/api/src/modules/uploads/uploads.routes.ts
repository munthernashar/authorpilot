import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthedRequest } from '../../common/middleware.js';
import { presignUpload } from '../../services/storage.service.js';
import { HttpError } from '../../common/http-error.js';

const presignSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  bookId: z.string().optional()
});

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const uploadsRouter = Router();
uploadsRouter.use(requireAuth);

uploadsRouter.post('/presign', async (req: AuthedRequest, res, next) => {
  try {
    const input = presignSchema.parse(req.body);

    if (input.sizeBytes > MAX_UPLOAD_BYTES) {
      throw new HttpError(400, 'File exceeds 25MB limit');
    }

    const objectKey = `private/${req.auth!.organizationId}/resources/${Date.now()}-${input.fileName}`;
    const bucket = process.env.S3_BUCKET_PRIVATE;
    if (!bucket) {
      throw new HttpError(500, 'S3_BUCKET_PRIVATE is not configured');
    }

    const uploadUrl = await presignUpload({
      bucket,
      key: objectKey,
      mimeType: input.mimeType,
      expiresIn: 300
    });

    res.status(201).json({ objectKey, uploadUrl, expiresInSeconds: 300 });
  } catch (err) {
    next(err);
  }
});
