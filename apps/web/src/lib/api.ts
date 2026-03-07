const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export async function apiRequest<T>(
  path: string,
  init?: RequestInit & {
    accessToken?: string;
  }
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (init?.headers) {
    Object.assign(headers, init.headers as Record<string, string>);
  }

  if (init?.accessToken) {
    headers.Authorization = `Bearer ${init.accessToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: 'no-store'
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export type DashboardSummary = {
  books: number;
  chapters: number;
  personas: number;
  queuedJobs: number;
  runningJobs: number;
};
