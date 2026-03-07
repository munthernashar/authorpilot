'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; fullName: string };
  organization: { id: string; name: string };
};

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, organizationName, password })
      });

      localStorage.setItem('authorpilot_access_token', response.accessToken);
      localStorage.setItem('authorpilot_refresh_token', response.refreshToken);
      localStorage.setItem('authorpilot_user', JSON.stringify(response.user));

      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="mb-4 text-2xl font-bold">Create account</h1>
      <form className="card space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full rounded-lg border p-2"
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
        <input
          className="w-full rounded-lg border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="w-full rounded-lg border p-2"
          type="text"
          placeholder="Organization"
          value={organizationName}
          onChange={(event) => setOrganizationName(event.target.value)}
          required
        />
        <input
          className="w-full rounded-lg border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button className="btn-primary w-full justify-center" disabled={loading} type="submit">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </main>
  );
}
