import { BookCard } from '@/components/books/book-card';

const books = [
  { id: 'b1', title: 'Lean Publishing Machine', subtitle: 'SaaS for Authors', status: 'WRITING', chapters: [{ id: '1' }] },
  { id: 'b2', title: 'Narrative Systems', subtitle: 'Design Better Stories', status: 'DRAFT', chapters: [] }
];

export default function BooksPage() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Books</h1>
        <button className="btn-primary">New Book</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
