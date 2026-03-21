import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/holidays
 * Returns the list of holidays for 2026.
 */
export async function GET() {
    try {
        const [rows]: any = await pool.query(`
            SELECT 
                id, 
                name, 
                date, 
                'India' as country, 
                type 
            FROM holidays 
            ORDER BY date ASC
        `);

        return NextResponse.json(rows);
    } catch (error: any) {
        console.error('[api/holidays] Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch holidays' },
            { status: 500 }
        );
    }
}
