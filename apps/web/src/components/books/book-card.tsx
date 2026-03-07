type Book = {
  id: string;
  title: string;
  subtitle?: string | null;
  status: string;
  chapters: Array<{ id: string }>;
};

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="card">
      <h3 className="text-lg font-semibold">{book.title}</h3>
      {book.subtitle ? <p className="text-sm text-slate-500">{book.subtitle}</p> : null}
      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span>Status: {book.status}</span>
        <span>{book.chapters.length} chapters</span>
      </div>
    </article>
  );
}
