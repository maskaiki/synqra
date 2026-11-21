import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SYNQRA — Industrial Knowledge Platform',
  description:
    'Intelligence, Connected by Evidence. Platform manajemen pengetahuan kegagalan peralatan industri minyak dan gas berbasis AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased bg-[var(--canvas)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
