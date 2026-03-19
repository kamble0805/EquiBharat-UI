import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        // 1. Detect AI table and columns dynamically
        const [aiTableRes]: any = await pool.query(`
            SELECT TABLE_NAME FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME IN ('news_events_ai', 'news_event_ai')
            LIMIT 1
        `);
        const aiTable = aiTableRes?.[0]?.TABLE_NAME;

        let fkCol = 'raw_event_id';
        if (aiTable) {
            const [aiCols]: any = await pool.query(`
                SELECT COLUMN_NAME FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
            `, [aiTable]);
            const colNames = aiCols.map((c: any) => c.COLUMN_NAME);
            if (colNames.includes('raw_event_id')) fkCol = 'raw_event_id';
            else if (colNames.includes('news_event_id')) fkCol = 'news_event_id';
            else if (colNames.includes('raw_news_id')) fkCol = 'raw_news_id';
        }

        // 2. Fetch news event core data
        const [newsRows]: any = await pool.query(
            'SELECT * FROM news_events WHERE id = ? LIMIT 1',
            [id]
        );

        if (!newsRows || newsRows.length === 0) {
            return NextResponse.json({ error: 'News not found' }, { status: 404 });
        }

        const row = newsRows[0];

        // 3. Fetch AI enrichment if table exists - FULL SCHEMA MAPPING
        let aiData: any = null;
        if (aiTable) {
            const [aiRows]: any = await pool.query(`
                SELECT 
                    simple_summary,
                    story_report,
                    who_is_affected,
                    market_impact_explanation,
                    likely_affected_indices,
                    likely_affected_sectors,
                    impact_direction,
                    confidence_level
                FROM \`${aiTable}\`
                WHERE \`${fkCol}\` = ?
                LIMIT 1
            `, [id]);
            if (aiRows && aiRows.length > 0) aiData = aiRows[0];
        }

        const parseArray = (val: any): string[] => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            try { return JSON.parse(val); } catch {
                return String(val).split(',').map((k: string) => k.trim()).filter(Boolean);
            }
        };

        const newsItem = {
            id: row.id.toString(),
            headline: row.title,
            summary: aiData?.simple_summary || row.summary,
            // Full Read Report (Markdown) prioritized for content area
            fullContent: aiData?.story_report || row.content,
            source: row.source,
            externalUrl: row.source_url,
            category: row.sector || 'General',
            // Synchronized with RAW impact level
            impact: (row.impact_level || 'low').toLowerCase(),
            published_date: row.published_at ? new Date(row.published_at).toISOString() : null,
            publishTime: row.published_at
                ? new Date(row.published_at).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
                : null,
            imageUrl: row.image_url ?? null,
            keywords: parseArray(row.matched_keywords),
            // COMPLETE AI DATA SECTION
            aiIntelligence: aiData ? {
                summary: aiData.simple_summary,
                who_is_affected: aiData.who_is_affected,
                market_impact_explanation: aiData.market_impact_explanation,
                likelyAffectedIndices: parseArray(aiData.likely_affected_indices),
                likelyAffectedSectors: parseArray(aiData.likely_affected_sectors),
                impactDirection: aiData.impact_direction,
                confidenceLevel: aiData.confidence_level
            } : null
        };

        return NextResponse.json(newsItem);
    } catch (error: any) {
        console.error('Error fetching news detail:', error);
        return NextResponse.json({ error: 'Failed to fetch news detail' }, { status: 500 });
    }
}
