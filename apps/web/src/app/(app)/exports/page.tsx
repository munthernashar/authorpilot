export default function ExportsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Exports</h1>
      <article className="card">
        <h2 className="font-semibold">Export Book</h2>
        <div className="mt-3 flex gap-3">
          <button className="btn-secondary">Export DOCX</button>
          <button className="btn-primary">Export PDF</button>
        </div>
      </article>
    </section>
  );
}
