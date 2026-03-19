import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Try to fetch from DB; if tables don't exist, fall back to empty arrays
        const [rows]: any = await pool.query(`
            SELECT 
                t.id,
                t.title,
                t.category,
                t.created_at,
                t.user_name,
                COUNT(r.id) AS reply_count,
                MAX(r.created_at) AS last_activity
            FROM forum_threads t
            LEFT JOIN forum_replies r ON r.thread_id = t.id
            GROUP BY t.id
            ORDER BY COALESCE(MAX(r.created_at), t.created_at) DESC
        `);

        return NextResponse.json(rows.map((row: any) => ({
            id: String(row.id),
            title: row.title,
            category: row.category,
            replies: Number(row.reply_count),
            lastActivity: row.last_activity
                ? new Date(row.last_activity).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
                : new Date(row.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }),
            author: row.user_name,
            createdAt: row.created_at,
        })));
    } catch (err: any) {
        console.error('[forum/threads GET]', err?.message);
        return NextResponse.json([]);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title, category, content, userName, userEmail } = await req.json();
        if (!title?.trim() || !content?.trim()) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        // Ensure tables exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS forum_threads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                category VARCHAR(100) DEFAULT 'General',
                user_name VARCHAR(200),
                user_email VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS forum_replies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                thread_id INT NOT NULL,
                content TEXT NOT NULL,
                user_name VARCHAR(200),
                user_email VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE
            )
        `);

        const [result]: any = await pool.query(
            `INSERT INTO forum_threads (title, category, user_name, user_email) VALUES (?, ?, ?, ?)`,
            [title.trim(), category || 'General', userName || 'Anonymous', userEmail || '']
        );

        const threadId = result.insertId;

        // Insert the first post as a reply
        await pool.query(
            `INSERT INTO forum_replies (thread_id, content, user_name, user_email) VALUES (?, ?, ?, ?)`,
            [threadId, content.trim(), userName || 'Anonymous', userEmail || '']
        );

        return NextResponse.json({ id: String(threadId) }, { status: 201 });
    } catch (err: any) {
        console.error('[forum/threads POST]', err?.message);
        return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
    }
}
