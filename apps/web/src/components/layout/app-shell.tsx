import Link from 'next/link';
import { LogoutButton } from './logout-button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/books', label: 'Books' },
  { href: '/personas', label: 'Personas' },
  { href: '/resources', label: 'Resources' },
  { href: '/covers', label: 'Covers' },
  { href: '/exports', label: 'Exports' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 p-4">
          <Link href="/dashboard" className="text-lg font-semibold">
            AuthorPilot
          </Link>
          <nav className="flex flex-1 flex-wrap justify-center gap-4 text-sm text-slate-600">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
