import type { Metadata } from 'next';
import { Space_Grotesk, Rajdhani, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'GuardianAngel AI',
  description: 'A next-gen smart home safety + emotional companion platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          spaceGrotesk.variable,
          rajdhani.variable,
          jetbrainsMono.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
