'use client';

import { useEffect, useState } from 'react';
import { apiRequest, type DashboardSummary } from '@/lib/api';

const fallback: DashboardSummary = {
  books: 0,
  chapters: 0,
  personas: 0,
  queuedJobs: 0,
  runningJobs: 0
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authorpilot_access_token') : null;
    if (!token) {
      setError('No access token found in localStorage (authorpilot_access_token). Showing fallback values.');
      return;
    }

    apiRequest<DashboardSummary>('/dashboard/summary', { accessToken: token })
      .then((data) => {
        setSummary(data);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, []);

  const cards = [
    { label: 'Books', value: summary.books },
    { label: 'Chapters', value: summary.chapters },
    { label: 'Personas', value: summary.personas },
    { label: 'Queued Jobs', value: summary.queuedJobs },
    { label: 'Running Jobs', value: summary.runningJobs }
  ];

  return (
    <section>
      <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
      {error ? <p className="mb-4 text-sm text-amber-700">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="card">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
