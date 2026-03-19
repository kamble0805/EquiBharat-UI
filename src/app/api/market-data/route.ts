import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol') || 'NIFTY';
    const interval = searchParams.get('interval') || '1m';

    try {
        // Generating real-feeling historical data server-side
        // In the future, this will come from a specialized market data API (e.g. Twelve Data, Alpha Vantage)
        const data = [];
        let time = Math.floor(Date.now() / 1000) - (1000 * 60); // 1000 minutes ago

        let lastClose = 24156;
        if (symbol === 'BANKNIFTY') lastClose = 51234;
        if (symbol === 'NIFTYMIDCAP') lastClose = 52890;

        for (let i = 0; i < 1000; i++) {
            const open = lastClose + (Math.random() - 0.5) * 50;
            const high = open + Math.random() * 30;
            const low = open - Math.random() * 30;
            const close = low + Math.random() * (high - low);

            data.push({
                time: time,
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
            });

            time += 60; // 1 minute interval
            lastClose = close;
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Market Data API error:', err);
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
    }
}
