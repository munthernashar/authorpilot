export default function BookWorkspacePage({ params }: { params: { bookId: string } }) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Book Workspace: {params.bookId}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="card">
          <h2 className="font-semibold">Market Analysis</h2>
          <p className="mt-2 text-sm text-slate-600">Upload references and run trend, audience, and competition analysis.</p>
          <button className="btn-primary mt-4">Run Analysis</button>
        </article>
        <article className="card">
          <h2 className="font-semibold">Title & Outline</h2>
          <p className="mt-2 text-sm text-slate-600">Generate AI title options and a structured chapter outline.</p>
          <div className="mt-4 flex gap-2">
            <button className="btn-secondary">Generate Titles</button>
            <button className="btn-primary">Generate Outline</button>
          </div>
        </article>
      </div>
    </section>
  );
}
