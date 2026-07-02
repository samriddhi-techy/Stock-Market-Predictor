import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AppLayout from '@/components/app-layout';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://stockai-demo.vercel.app'),
  title: {
    default: 'StockAI — AI-Powered Market Intelligence',
    template: '%s | StockAI',
  },
  description:
    'Advanced stock market analytics with AI-powered predictions, real-time data visualization, and intelligent portfolio management. Educational purposes only.',
  keywords: ['stock market', 'AI predictions', 'portfolio', 'trading', 'analytics', 'fintech'],
  authors: [{ name: 'StockAI Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'StockAI — AI-Powered Market Intelligence',
    description: 'Advanced stock market analytics with AI-powered predictions and portfolio management.',
    siteName: 'StockAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StockAI — AI-Powered Market Intelligence',
    description: 'Advanced stock market analytics with AI-powered predictions.',
  },
  robots: { index: true, follow: true },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Skip to main content for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}