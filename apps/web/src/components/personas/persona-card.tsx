type Persona = {
  id: string;
  name: string;
  tone: string;
  audience: string;
  genre: string;
};

export function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <article className="card">
      <h3 className="text-lg font-semibold">{persona.name}</h3>
      <p className="mt-2 text-sm text-slate-600">Tone: {persona.tone}</p>
      <p className="text-sm text-slate-600">Audience: {persona.audience}</p>
      <p className="text-sm text-slate-600">Genre: {persona.genre}</p>
    </article>
  );
}
