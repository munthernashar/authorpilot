import { prisma } from '../config/prisma.js';
import { generateImageBase64 } from '../services/ai.js';

type Payload = { aiJobId: string; bookId: string; prompt: string; size?: '1024x1024' | '1536x1024' | '1024x1536' };

export const handleImageJob = async (payload: Payload, type: 'image_generation' | 'cover_generation') => {
  await prisma.aiJob.update({ where: { id: payload.aiJobId }, data: { status: 'RUNNING', progress: 10 } });

  const imageBase64 = await generateImageBase64(payload.prompt, payload.size ?? '1024x1024');

  await prisma.aiJob.update({
    where: { id: payload.aiJobId },
    data: {
      status: 'COMPLETED',
      progress: 100,
      type,
      outputJson: { imageBase64 }
    }
  });
};
