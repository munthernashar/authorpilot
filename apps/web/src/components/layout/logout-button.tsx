'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authorpilot_access_token');
    localStorage.removeItem('authorpilot_refresh_token');
    localStorage.removeItem('authorpilot_user');
    router.push('/login');
  };

  return (
    <button className="btn-secondary" onClick={handleLogout} type="button">
      Logout
    </button>
  );
}
