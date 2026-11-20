import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SYNQRA — Industrial Knowledge Platform',
  description: 'Intelligence connected by evidence. Oil & Gas industrial asset failure reporting & knowledge platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
