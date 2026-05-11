import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Think & Grow Rich — AI Self-Development Dashboard',
  description:
    'Master the 13 Principles of Success with your personal AI mentor. Track progress, receive guided coaching, and transform Napoleon Hill\'s philosophy into daily action.',
  keywords: ['Think and Grow Rich', 'self-development', 'AI assistant', 'Napoleon Hill', '13 principles'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  );
}
