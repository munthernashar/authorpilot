import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AuthorPilot',
  description: 'AI-assisted SaaS for writing books chapter-by-chapter.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
