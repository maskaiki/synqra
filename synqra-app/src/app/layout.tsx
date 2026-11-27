import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SYNQRA · Unit 11 CDU PT Pertamina RU VI Balongan',
  description:
    'Intelligence, Connected by Evidence. Platform manajemen pengetahuan keandalan & keselamatan proses berbasis bukti untuk Unit 11 (CDU - Crude Distillation Unit) PT Pertamina RU VI Balongan.',
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
