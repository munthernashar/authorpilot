import { ChapterEditor } from '@/components/editor/chapter-editor';

export default function ChapterPage({ params }: { params: { bookId: string; chapterId: string } }) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">
        Book {params.bookId} · Chapter {params.chapterId}
      </h1>
      <ChapterEditor initialContent={'# Chapter draft\n\nWrite your chapter section-by-section.'} />
    </section>
  );
}
