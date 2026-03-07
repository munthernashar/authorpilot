import { prisma } from '../config/prisma.js';
import { generateText } from '../services/ai.js';

type Payload = { aiJobId: string; bookId: string; targetChapters: number };

export const handleOutlineJob = async (payload: Payload) => {
  await prisma.aiJob.update({ where: { id: payload.aiJobId }, data: { status: 'RUNNING', progress: 10 } });

  const book = await prisma.book.findUnique({ where: { id: payload.bookId } });
  if (!book) throw new Error('Book not found');

  const prompt = `Create a non-repetitive chapter outline for book title "${book.title}" with ${payload.targetChapters} chapters. Return valid JSON as {"chapters":[{"title":"...","goal":"...","sections":[{"title":"...","brief":"..."}]}]}`;
  const raw = await generateText(prompt, 1800, 0.4);
  const parsed = JSON.parse(raw) as {
    chapters: Array<{ title: string; goal: string; sections: Array<{ title: string; brief: string }> }>;
  };

  await prisma.$transaction(async (tx) => {
    await tx.chapter.deleteMany({ where: { bookId: payload.bookId } });
    for (const [index, chapter] of parsed.chapters.entries()) {
      await tx.chapter.create({
        data: {
          bookId: payload.bookId,
          title: chapter.title,
          position: index + 1,
          content: `## Goal\n${chapter.goal}\n\n${chapter.sections
            .map((section) => `### ${section.title}\n${section.brief}`)
            .join('\n\n')}`
        }
      });
    }
    await tx.book.update({ where: { id: payload.bookId }, data: { status: 'OUTLINE_READY' } });
    await tx.aiJob.update({
      where: { id: payload.aiJobId },
      data: { status: 'COMPLETED', progress: 100, outputJson: parsed }
    });
  });
};
