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
        let query = `SELECT * FROM market_pulse_daily`;
        let params: any[] = [];
        if (dateParam) {
            query += ` WHERE DATE(pulse_date) = ?`;
            params.push(dateParam);
        }
        query += ` ORDER BY pulse_date DESC, created_at DESC LIMIT 1`;

        const [pulseRows]: any = await pool.query(query, params);
        
        if (pulseRows.length === 0) {
            return NextResponse.json({ 
                pulse: { summary: 'No intelligence pulse recorded for this timeframe.' },
                sectors: [],
                events: []
            });
        }

        const data = pulseRows[0];
        const pulseDate = data.pulse_date;

        // 2. Fetch sectoral aggregation from news_events for that date (or all recent if dateParam is null)
        let sectorQuery = `
            SELECT sector, SUM(signal_score) as score, COUNT(*) as total_signals 
            FROM news_events 
            WHERE sector IS NOT NULL AND sector != ''
        `;
        let sectorParams: any[] = [];
        if (dateParam) {
            sectorQuery += ` AND DATE(published_at) = ?`;
            sectorParams.push(dateParam);
        } else {
            // If fetching latest pulse, use its date for sectors too
            sectorQuery += ` AND DATE(published_at) = ?`;
            sectorParams.push(new Date(pulseDate).toISOString().split('T')[0]);
        }
        sectorQuery += ` GROUP BY sector ORDER BY ABS(SUM(signal_score)) DESC LIMIT 12`;

        const [sectorRows]: any = await pool.query(sectorQuery, sectorParams);

        // 3. Map Triggers (The UI expects a list of strings, the DB has JSON objects)
        let rawTriggers = [];
        try {
            rawTriggers = typeof data.top_triggers === 'string' ? JSON.parse(data.top_triggers) : (data.top_triggers || []);
        } catch (e) { rawTriggers = []; }

        const mappedTriggers = rawTriggers.map((t: any) => {
            if (typeof t === 'string') return t;
            if (t.title && t.impact) return `${t.title}: ${t.impact}`;
            return t.title || t.description || JSON.stringify(t);
        });

        // 4. Fetch Holidays
        const [holidayTableRes]: any = await pool.query(`SHOW TABLES LIKE 'holidays'`);
        let upcomingHolidays: any[] = [];
        if (holidayTableRes.length > 0) {
            const [holidayRows]: any = await pool.query(`
                SELECT name, date FROM holidays 
                WHERE date >= ?
                ORDER BY date ASC LIMIT 5
            `, [dateParam || new Date().toISOString().split('T')[0]]);
            
            upcomingHolidays = holidayRows.map((h: any) => ({
                event_name: `[Holiday] ${h.name}`,
                impact_level: 'Moderate',
                country: 'India',
                event_time: h.date
            }));
        }

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
            events: [...upcomingHolidays]
        });
    } catch (error) {
        console.error('Market Pulse API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch market pulse' }, { status: 500 });
    }
}

