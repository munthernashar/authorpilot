import { PersonaCard } from '@/components/personas/persona-card';

const personas = [
  { id: 'p1', name: 'Visionary Strategist', tone: 'Bold and clear', audience: 'Startup founders', genre: 'Business' },
  { id: 'p2', name: 'Empathetic Mentor', tone: 'Warm and supportive', audience: 'First-time authors', genre: 'Self-help' }
];

export default function PersonasPage() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Author Personas</h1>
        <button className="btn-primary">New Persona</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {personas.map((persona) => (
          <PersonaCard key={persona.id} persona={persona} />
        ))}
      </div>
    </section>
  );
}
