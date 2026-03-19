import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [rows]: any = await pool.query(`
            SELECT * FROM news_events 
            ORDER BY published_at DESC 
            LIMIT 50
        `);

        const newsItems = rows.map((row: any) => ({
            id: row.id.toString(),
            headline: row.title,
            summary: row.summary,
            fullContent: row.content,
            source: row.source,
            externalUrl: row.source_url,
            category: row.sector || 'General',
            impact: (row.impact_level || 'low').toLowerCase(),
            sentiment: row.sentiment || 0,
            publishTime: new Date(row.published_at).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }),
            keywords: parseArrayField(row.matched_keywords),
        }));

        return NextResponse.json(newsItems);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}

function parseArrayField(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter((v: any) => v !== null && v !== undefined && v !== '');
    try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.filter((v: any) => v !== null && v !== undefined && v !== '');
    } catch { /* fall through */ }
    return String(val).split(',').map((s: string) => s.trim()).filter(Boolean);
}
