import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const [rows]: any = await pool.query(
            `SELECT p.* 
             FROM user_display_preferences p
             JOIN users u ON p.user_id = u.id
             WHERE u.email = ? LIMIT 1`,
            [email]
        );

        if (!rows || rows.length === 0) {
            return NextResponse.json({ preferences: null });
        }

        return NextResponse.json({ preferences: rows[0] });
    } catch (err: any) {
        console.error('[display/get]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { email, theme, fontSize, compactMode, reducedMotion, timezone, dateFormat } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Find user ID
        const [users]: any = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
        if (!users || users.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = users[0].id;

        // Upsert preferences
        await pool.query(
            `INSERT INTO user_display_preferences (user_id, theme, font_size, compact_mode, reduced_motion, timezone, date_format)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                theme = VALUES(theme),
                font_size = VALUES(font_size),
                compact_mode = VALUES(compact_mode),
                reduced_motion = VALUES(reduced_motion),
                timezone = VALUES(timezone),
                date_format = VALUES(date_format)`,
            [
                userId,
                theme || 'dark',
                fontSize || 16,
                compactMode ? 1 : 0,
                reducedMotion ? 1 : 0,
                timezone || 'Asia/Kolkata',
                dateFormat || 'DD/MM/YYYY'
            ]
        );

        return NextResponse.json({ success: true, message: 'Preferences saved' });
    } catch (err: any) {
        console.error('[display/post]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
