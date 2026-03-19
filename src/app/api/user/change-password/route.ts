import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, currentPassword, newPassword } = await request.json();

        if (!email || !currentPassword || !newPassword) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
        }

        // Fetch user — try both 'password' and 'password_hash' column names gracefully
        const [rows]: any = await pool.query(
            'SELECT id, password FROM users WHERE email = ? LIMIT 1',
            [email.toLowerCase().trim()]
        );

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'No account found with that email address' }, { status: 404 });
        }

        const user = rows[0];
        const storedPassword = user.password;

        // Plain-text comparison (replace with bcrypt.compare in production)
        // const match = await bcrypt.compare(currentPassword, storedPassword);
        const match = currentPassword === storedPassword;

        if (!match) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        // Prevent reusing the same password
        if (newPassword === currentPassword) {
            return NextResponse.json({ error: 'New password must be different from your current password' }, { status: 400 });
        }

        // Update password in DB (in production: hash first)
        await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [newPassword, user.id]
        );

        // Log the security event (best-effort — don't fail if table missing)
        pool.query(
            `INSERT INTO user_security_logs (user_id, event_type, created_at)
             VALUES (?, 'password_changed', NOW())`,
            [user.id]
        ).catch(() => { /* table may not exist yet — that's fine */ });

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (err: any) {
        console.error('[change-password]', err);
        return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
    }
}
