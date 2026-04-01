import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASE_URL ?? 'https://equibharat.com'
    ),
    title: {
        default: 'EquiBharat – India Economic Intelligence Terminal',
        template: '%s | EquiBharat',
    },
    description:
        'Calendar-driven economic analysis for Indian markets. AI-enriched news, RBI & PIB updates, sector impact, and market insights – structured and factual.',
    keywords: [
        'India economic calendar',
        'RBI news', 'PIB updates', 'NSE', 'BSE', 'Nifty',
        'market intelligence', 'economic events India',
    ],
    authors: [{ name: 'EquiBharat' }],
    creator: 'EquiBharat',
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'EquiBharat',
        title: 'EquiBharat – India Economic Intelligence',
        description:
            'AI-enriched economic calendar for Indian equity markets. RBI, PIB, and macroeconomic events explained simply.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'EquiBharat – India Economic Intelligence',
        description: 'Calendar-driven economic analysis for Indian markets.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <AppShell>{children}</AppShell>
                </Providers>
            </body>
        </html>
    );
}
