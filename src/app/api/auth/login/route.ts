import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Fetch user from DB
        const [rows]: any = await pool.query(
            'SELECT id, name, email, phone, job_title, bio, password, role FROM users WHERE email = ? LIMIT 1',
            [email.toLowerCase().trim()]
        );

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const user = rows[0];

        // Compare passwords (plain text — swap for bcrypt.compare in production)
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = password === user.password;

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Return safe user data (never return password)
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                jobTitle: user.job_title || '',
                bio: user.bio || '',
                role: user.role || 'user',
            },
        });
    } catch (err: any) {
        console.error('[auth/login]', err);
        return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
    }
}
