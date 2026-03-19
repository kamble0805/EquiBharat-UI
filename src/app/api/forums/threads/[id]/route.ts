import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/forums/threads/[id] - get thread + replies
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const [threads]: any = await pool.query(
            `SELECT id, title, category, user_name, created_at FROM forum_threads WHERE id = ?`,
            [id]
        );
        if (!threads.length) return NextResponse.json({ error: 'Thread not found' }, { status: 404 });

        const [replies]: any = await pool.query(
            `SELECT id, content, user_name, created_at FROM forum_replies WHERE thread_id = ? ORDER BY created_at ASC`,
            [id]
        );

        return NextResponse.json({
            thread: threads[0],
            replies: replies.map((r: any) => ({
                id: String(r.id),
                content: r.content,
                author: r.user_name || 'Anonymous',
                createdAt: r.created_at,
                timeAgo: new Date(r.created_at).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
                }),
            })),
        });
    } catch (err: any) {
        console.error('[forum/threads/[id] GET]', err?.message);
        return NextResponse.json({ error: 'Failed to fetch thread' }, { status: 500 });
    }
}

// POST /api/forums/threads/[id] - add a reply
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { content, userName, userEmail } = await req.json();

        if (!content?.trim()) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const [result]: any = await pool.query(
            `INSERT INTO forum_replies (thread_id, content, user_name, user_email) VALUES (?, ?, ?, ?)`,
            [id, content.trim(), userName || 'Anonymous', userEmail || '']
        );

        return NextResponse.json({
            id: String(result.insertId),
            content: content.trim(),
            author: userName || 'Anonymous',
            timeAgo: 'just now',
        }, { status: 201 });
    } catch (err: any) {
        console.error('[forum/threads/[id] POST]', err?.message);
        return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 });
    }
}
