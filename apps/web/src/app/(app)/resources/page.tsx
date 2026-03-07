export default function ResourcesPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Resources</h1>
      <article className="card">
        <h2 className="font-semibold">Upload Resource</h2>
        <p className="mt-2 text-sm text-slate-600">Upload references, notes, and source material for AI retrieval.</p>
        <input className="mt-4 block w-full text-sm" type="file" />
      </article>
    </section>
  );
}
