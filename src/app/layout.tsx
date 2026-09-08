import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DK Resume Builder | Free, Offline-First & ATS Friendly',
  description:
    'A 100% free, privacy-friendly, offline-first resume builder for developers. All data is saved strictly in your browser local storage with zero analytics and zero tracking. Built by a developer to help other devs create clean, ATS-compliant resumes.',
  keywords: [
    'DK resume builder',
    'developer resume builder',
    'offline resume builder',
    'privacy friendly resume',
    'local storage resume',
    'ATS resume builder',
    'free resume builder',
    'zero tracking',
  ],
  authors: [{ name: 'DK' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#FAF8F2]">
        {children}
      </body>
    </html>
  );
}
