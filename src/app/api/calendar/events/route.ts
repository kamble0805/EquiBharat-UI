import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/calendar/events
 *
 * Returns AI-enriched events from the news_events_ai table joined with news_events.
 * This provides summarized reports for the calendar view.
 */
export async function GET() {
    try {
        // 1. Detect AI table and foreign key column dynamically
        const [aiTableRes]: any = await pool.query(`
            SELECT TABLE_NAME FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN ('news_events_ai', 'news_event_ai')
            LIMIT 1
        `);
        const aiTable = aiTableRes?.[0]?.TABLE_NAME;

        if (!aiTable) {
            return NextResponse.json([]); // No AI table, no calendar events
        }

        let fkCol = 'raw_event_id';
        const [aiCols]: any = await pool.query(`
            SELECT COLUMN_NAME FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
        `, [aiTable]);
        const colNames = aiCols.map((c: any) => c.COLUMN_NAME);
        if (colNames.includes('raw_event_id')) fkCol = 'raw_event_id';
        else if (colNames.includes('news_event_id')) fkCol = 'news_event_id';
        else if (colNames.includes('raw_news_id')) fkCol = 'raw_news_id';

        // 2. Fetch data using the detected schema - Prioritize raw impact level for consistency
        const [rows]: any = await pool.query(`
            SELECT 
                nea.id AS event_id,
                ne.id AS raw_news_id,
                ne.title,
                ne.source,
                ne.impact_level AS raw_impact,
                ne.sector AS category,
                ne.published_at AS published_date,
                nea.simple_summary AS summary,
                nea.impact_direction,
                nea.likely_affected_indices,
                nea.likely_affected_sectors,
                ne.matched_keywords AS keywords,
                nea.market_impact_explanation
            FROM \`${aiTable}\` nea
            JOIN news_events ne ON nea.\`${fkCol}\` = ne.id
            ORDER BY ne.published_at DESC
            LIMIT 100
        `);

        const events = rows.map((row: any) => {
            const impact = (row.raw_impact || 'low').toLowerCase();
            return {
                id: row.event_id.toString(),
                raw_news_id: row.raw_news_id.toString(),
                title: row.title,
                source: row.source,
                category: row.category || 'General',
                summary: row.summary || '',
                simple_summary: row.summary || '',
                impact_level: impact,
                overall_impact_level: impact,
                impact_direction: mapDirection(row.impact_direction),
                likely_affected_indices: parseArrayField(row.likely_affected_indices),
                likely_affected_sectors: parseArrayField(row.likely_affected_sectors),
                keywords: parseArrayField(row.keywords),
                published_date: row.published_date,
                explanation: row.market_impact_explanation
            };
        });

        // 3. Fetch holidays from the 'holidays' table if it exists
        const [holidayTableRes]: any = await pool.query(`
            SHOW TABLES LIKE 'holidays'
        `);
        
        let holidayEvents: any[] = [];
        if (holidayTableRes.length > 0) {
            const [holidayRows]: any = await pool.query(`
                SELECT 
                    id, 
                    name, 
                    date, 
                    type 
                FROM holidays 
                ORDER BY date ASC
            `);

            holidayEvents = holidayRows.map((h: any) => ({
                id: `holiday-${h.id}`,
                raw_news_id: `h-${h.id}`,
                title: h.name,
                source: 'Market Holiday',
                category: h.type || 'Holiday',
                summary: `${h.name} - Market Closed`,
                simple_summary: `${h.name} - Market Closed`,
                impact_level: 'moderate',
                overall_impact_level: 'moderate',
                impact_direction: 'neutral',
                likely_affected_indices: [],
                likely_affected_sectors: [],
                keywords: ['holiday', 'india'],
                published_date: h.date,
                explanation: `Exchange holiday observed in India.`
            }));
        }

        // Combine and sorta by date
        const combinedEvents = [...events, ...holidayEvents];
        combinedEvents.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());

        return NextResponse.json(combinedEvents);
    } catch (error: any) {
        console.error('[calendar/events] Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch calendar events from AI table' },
            { status: 500 }
        );
    }
}

function mapDirection(dir: string | null): string | null {
    if (!dir) return null;
    const lower = dir.toLowerCase();
    if (lower === 'positive') return 'bullish';
    if (lower === 'negative') return 'bearish';
    if (lower === 'neutral') return 'neutral';
    if (lower === 'mixed') return 'neutral';
    return lower;
}

function parseArrayField(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}
