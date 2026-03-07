import { prisma } from '../config/prisma.js';
import { generateText } from '../services/ai.js';

type Payload = { aiJobId: string; chapterId: string; styleGuide: string; maxWords: number };

export const handleChapterContinueJob = async (payload: Payload) => {
  await prisma.aiJob.update({ where: { id: payload.aiJobId }, data: { status: 'RUNNING', progress: 10 } });

  const chapter = await prisma.chapter.findUnique({ where: { id: payload.chapterId } });
  if (!chapter) throw new Error('Chapter not found');

  const prompt = `Continue chapter "${chapter.title}" in markdown, avoid repetition. Style: ${payload.styleGuide}. Max new words: ${payload.maxWords}. Current draft:\n${chapter.content ?? ''}`;
  const addition = await generateText(prompt, 1400, 0.7);

  const updated = await prisma.chapter.update({
    where: { id: payload.chapterId },
    data: { content: `${chapter.content ?? ''}\n\n${addition}`.trim() }
  });

  await prisma.aiJob.update({
    where: { id: payload.aiJobId },
    data: { status: 'COMPLETED', progress: 100, outputJson: { chapterId: updated.id, addition } }
  });
};
