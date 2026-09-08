import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Studio115 Admin',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
