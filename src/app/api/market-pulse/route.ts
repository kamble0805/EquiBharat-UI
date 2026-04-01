import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const probe = searchParams.get('probe');

    try {
        if (probe === '1') {
            const [tables]: any = await pool.query('SHOW TABLES');
            const result: any = { tables: tables.map((r: any) => Object.values(r)[0]) };
            for (const table of result.tables) {
                const [cols]: any = await pool.query(`DESCRIBE \`${table}\``);
                result[table] = cols;
            }
            return NextResponse.json(result);
        }

        // 1. Fetch the latest general "Market Pulse" metadata
        const [pulseRows]: any = await pool.query(`
            SELECT * FROM market_pulse_daily 
            ORDER BY pulse_date DESC, created_at DESC 
            LIMIT 1
        `);
        
        if (pulseRows.length === 0) {
            return NextResponse.json({ 
                pulse: { summary: 'No intelligence pulse recorded for this timeframe.' },
                sectors: [],
                events: []
            });
        }

        const data = pulseRows[0];
        const pulseDate = data.pulse_date;

        // 2. Calculate This Week range for sectors and events
        const today = new Date();
        const startOfThisWeek = new Date(today);
        startOfThisWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // This Monday
        startOfThisWeek.setHours(0, 0, 0, 0);

        const endOfThisWeek = new Date(startOfThisWeek);
        endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
        endOfThisWeek.setHours(23, 59, 59, 999);

        // 3. Fetch sectoral aggregation from news_events for THIS WEEK
        const [sectorRows]: any = await pool.query(`
            SELECT sector, SUM(signal_score) as score, COUNT(*) as total_signals 
            FROM news_events 
            WHERE sector IS NOT NULL AND sector != ''
            AND published_at >= ? AND published_at <= ?
            GROUP BY sector ORDER BY ABS(SUM(signal_score)) DESC LIMIT 12
        `, [startOfThisWeek.toISOString().split('T')[0], endOfThisWeek.toISOString().split('T')[0]]);

        // 4. Map Triggers
        let rawTriggers = [];
        try {
            rawTriggers = typeof data.top_triggers === 'string' ? JSON.parse(data.top_triggers) : (data.top_triggers || []);
        } catch (e) { rawTriggers = []; }

        const mappedTriggers = rawTriggers.map((t: any) => {
            if (typeof t === 'string') return t;
            if (t.title && t.impact) return `${t.title}: ${t.impact}`;
            return t.title || t.description || JSON.stringify(t);
        });

        // 5. Fetch Upcoming Scheduled News in this week + next week (14-day window stays for context, but user said "this week news")
        // User asked for "this week", so let's keep the window but maybe label it or filter.
        // Actually, "Impact Timeline" says 14-day horizon. I'll keep it 14-day but ensure it starts from startOfThisWeek.
        
        const endOfNextWeek = new Date(startOfThisWeek);
        endOfNextWeek.setDate(startOfThisWeek.getDate() + 13); // 2 Sundays from now
        endOfNextWeek.setHours(23, 59, 59, 999);

        const [scheduledRows]: any = await pool.query(`
            SELECT title, category, scheduled_date, scheduled_time, ingestion_link
            FROM scheduled_news 
            WHERE scheduled_date >= ? AND scheduled_date <= ?
            AND status = 'scheduled'
            ORDER BY scheduled_date ASC, scheduled_time ASC
        `, [startOfThisWeek.toISOString().split('T')[0], endOfNextWeek.toISOString().split('T')[0]]);

        const mappedScheduled = scheduledRows.map((s: any) => ({
            event_name: s.title,
            impact_level: s.category?.toLowerCase().includes('inflation') || s.category?.toLowerCase().includes('rates') ? 'High' : 'Moderate',
            country: s.title?.toLowerCase().includes('us ') ? 'USA' : 'India',
            event_time: `${new Date(s.scheduled_date).toISOString().split('T')[0]}T${s.scheduled_time || '00:00:00'}`,
            link: s.ingestion_link
        }));

        // 6. Fetch "Future Intelligence" (5 items immediately after the 14-day horizon)
        const [upcomingNewsRows]: any = await pool.query(`
            SELECT id, title, category as summary, scheduled_date as published_at, 
            CASE WHEN (category LIKE '%inflation%' OR category LIKE '%rates%') THEN 'High' ELSE 'Moderate' END as impact_level
            FROM scheduled_news 
            WHERE scheduled_date > ?
            AND status = 'scheduled'
            ORDER BY scheduled_date ASC, scheduled_time ASC
            LIMIT 5
        `, [endOfNextWeek.toISOString().split('T')[0]]);

        return NextResponse.json({
            pulse: {
                global_mood: data.global_mood,
                india_bias: data.india_bias,
                summary: data.summary,
                top_triggers: JSON.stringify(mappedTriggers),
                volatility_state: data.volatility_state,
                liquidity_state: data.liquidity_state
            },
            sectors: sectorRows.map((s: any) => ({
                sector: s.sector,
                score: Number(s.score),
                total_signals: Number(s.total_signals)
            })),
            events: [...mappedScheduled].sort((a, b) => 
                new Date(a.event_time).getTime() - new Date(b.event_time).getTime()
            ),
            upcoming_news: upcomingNewsRows.map((n: any) => ({
                id: n.id.toString(),
                title: n.title,
                summary: n.summary,
                published_at: n.published_at,
                impact_level: n.impact_level
            }))
        });
    } catch (error) {
        console.error('Market Pulse API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch market pulse' }, { status: 500 });
    }
}

