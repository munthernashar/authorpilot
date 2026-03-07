export default function CoversPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Book Covers</h1>
      <article className="card">
        <h2 className="font-semibold">AI Cover Generator</h2>
        <textarea className="mt-3 min-h-24 w-full rounded-lg border p-2" placeholder="Describe cover style and concept" />
        <button className="btn-primary mt-3">Generate Cover</button>
      </article>
    </section>
  );
}
