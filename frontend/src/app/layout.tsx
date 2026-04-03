import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/utils/theme';

export const metadata: Metadata = {
  title: 'Zorvyn — Finance',
  description: 'Enterprise finance management platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
