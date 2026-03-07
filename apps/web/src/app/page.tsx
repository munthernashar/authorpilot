import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold">AuthorPilot</h1>
      <p className="max-w-2xl text-slate-600">
        Multi-tenant AI writing platform for market analysis, title/outline generation, chapter-by-chapter drafting,
        covers, and exports.
      </p>
      <div className="flex gap-3">
        <Link className="btn-primary" href="/dashboard">
          Open Dashboard
        </Link>
        <Link className="btn-secondary" href="/login">
          Login
        </Link>
      </div>
    </main>
  );
}
