import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, name, phone, jobTitle, bio } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required to identify user' }, { status: 400 });
        }

        // Find user by email
        const [rows]: any = await pool.query(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [email.toLowerCase().trim()]
        );

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = rows[0].id;

        // Update the users table
        await pool.query(
            `UPDATE users
             SET name = ?, phone = ?, job_title = ?, bio = ?
             WHERE id = ?`,
            [
                name || null,
                phone || null,
                jobTitle || null,
                bio || null,
                userId,
            ]
        );

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: { id: userId, name, email, phone, jobTitle, bio },
        });
    } catch (err: any) {
        console.error('[user/profile]', err);
        return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
    }
}
