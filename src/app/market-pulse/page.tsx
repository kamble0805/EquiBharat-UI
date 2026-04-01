'use client';

import dynamic from 'next/dynamic';

const MarketPulsePage = dynamic(() => import('@/views/MarketPulsePage'), {
  ssr: false,
});

export default function Page() {
  return <MarketPulsePage />;
}
