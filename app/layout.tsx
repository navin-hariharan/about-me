import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://navin-hariharan.com'),
  title: 'Navin Hariharan — Security, systems & strategy',
  description: 'Navin Hariharan is a cybersecurity expert and systems builder in the United Kingdom, focused on making complex technology safer and more resilient.',
  openGraph: {
    title: 'Navin Hariharan — Security, systems & strategy',
    description: 'Building secure, resilient systems for a more confident digital future.',
    url: 'https://navin-hariharan.com',
    siteName: 'Navin Hariharan',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#101310',
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
