import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SANCTUARY | The Curated Architecture & Stays Collective',
  description: 'An antidote to mass vacation rentals. The top 1% architectural sanctuaries, audited against our 100-point vetting standard with bespoke concierge support.',
  keywords: ['luxury villa rentals', 'architectural stays', 'boutique design homes', 'curated vacation rentals', 'concierge stays'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0c0e] text-[#ede8df] flex flex-col antialiased selection:bg-[#c5a880]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
