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
        // Fetch a unified feed of realized news (calendar_news) and upcoming events (scheduled_news)
        // This ensures the calendar shows both history and the road ahead.
        const [rows]: any = await pool.query(`
            SELECT * FROM (
                SELECT 
                    cn.id, 
                    cn.title, 
                    cn.category, 
                    cn.event_date, 
                    cn.event_time, 
                    cn.ai_summary, 
                    cn.description,
                    cn.source_link, 
                    cn.source_name, 
                    cn.speaker, 
                    cn.usual_effect, 
                    cn.why_traders_care, 
                    cn.actual_value, 
                    cn.forecast_value, 
                    cn.previous_value,
                    cn.scheduled_news_id,
                    'REALIZED' as record_type,
                    (
                        SELECT prev.source_link 
                        FROM calendar_news prev 
                        WHERE prev.title = cn.title 
                          AND (
                            prev.event_date < cn.event_date 
                            OR (prev.event_date = cn.event_date AND prev.event_time < cn.event_time)
                          )
                        ORDER BY prev.event_date DESC, prev.event_time DESC 
                        LIMIT 1
                    ) as previous_news_link
                FROM calendar_news cn

                UNION ALL

                SELECT 
                    sn.id, 
                    sn.title, 
                    sn.category, 
                    sn.scheduled_date as event_date, 
                    sn.scheduled_time as event_time, 
                    'Upcoming event: Institutional coverage will pulsate upon data release.' as ai_summary, 
                    'Scheduled for release' as description,
                    sn.ingestion_link as source_link, 
                    'Institutional Schedule' as source_name, 
                    'Scheduled Data Release' as speaker, 
                    NULL as usual_effect, 
                    'Traders are preparing for the release of ' || sn.title || ' to assess trend strength.' as why_traders_care, 
                    NULL as actual_value, 
                    NULL as forecast_value, 
                    NULL as previous_value,
                    NULL as scheduled_news_id,
                    'UPCOMING' as record_type,
                    NULL as previous_news_link
                FROM scheduled_news sn
                WHERE sn.id NOT IN (SELECT scheduled_news_id FROM calendar_news WHERE scheduled_news_id IS NOT NULL)
            ) as unified_feed
            ORDER BY event_date DESC, event_time DESC
            LIMIT 1000
        `);

        // Safe parsing for usual_effect: ensuring it is always returned as a single high-fidelity string
        const safeUsualEffect = (val: any): string => {
            if (!val) return 'Actual > Forecast = Bullish for Currency Performance';
            
            try {
                const parsed = typeof val === 'string' ? JSON.parse(val) : val;
                if (parsed && typeof parsed === 'object') {
                    if (parsed.full) return parsed.full;
                    if (parsed.bullish && parsed.bearish) {
                        return `Bullish: ${parsed.bullish} | Bearish: ${parsed.bearish}`;
                    }
                    return parsed.bullish || parsed.bearish || String(val);
                }
            } catch {
                // Return original string if not JSON
                return String(val);
            }
            return String(val);
        };

        // Format for the PremiumEconomicCalendar component
        const formattedEvents = rows.map((row: any) => {
            let dateStr = '';
            if (row.event_date instanceof Date) {
               // Safely extract the exact local date components to avoid toISOString() shifting the day by -1
               const yyyy = row.event_date.getFullYear();
               const mm = String(row.event_date.getMonth() + 1).padStart(2, '0');
               const dd = String(row.event_date.getDate()).padStart(2, '0');
               dateStr = `${yyyy}-${mm}-${dd}`;
            } else {
               dateStr = String(row.event_date).split('T')[0];
            }

            return {
                id: `${row.record_type}_${row.id}`,
                raw_news_id: String(row.id),
                title: row.title,
                summary: row.ai_summary || row.description,
                category: row.category,
                // Construct a valid local ISO date string without shifting timezone
                published_date: `${dateStr}T${row.event_time || '00:00:00'}`,
                source: row.source_name || (row.record_type === 'UPCOMING' ? 'Scheduled Event' : 'Market Intelligence'),
                impact_level: row.record_type === 'UPCOMING' ? 'low' : 'medium', // Color-code upcoming as low until confirmed
                impact_direction: mapDirection(row.impact_direction),
                link: row.source_link,
                // Premium enrichment fields
                currency: 'INR', // Default to INR but can be contextualized later
                usual_effect: safeUsualEffect(row.usual_effect),
                why_traders_care: row.why_traders_care,
                // Premium footer authority
                speaker: row.source_name || row.speaker || 'Official Publication',
                verify_link: row.source_link,
                // Custom field for the "link to previous news"
                previous_news_link: row.previous_news_link
            };
        });

        return NextResponse.json(formattedEvents);
    } catch (error: any) {
        console.error('[calendar/events] Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch calendar events' },
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
