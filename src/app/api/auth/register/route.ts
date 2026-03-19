import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
    try {
        const { name, email, phone, username, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }

        const emailNorm = email.toLowerCase().trim();

        // Check if email already exists
        const [existingEmail]: any = await pool.query(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [emailNorm]
        );
        if (existingEmail && existingEmail.length > 0) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
        }

        // Generate a username if not provided
        const baseUsername = username?.trim() || emailNorm.split('@')[0].replace(/[^a-z0-9_]/gi, '');
        let finalUsername = baseUsername;

        // Ensure username is unique by appending a random suffix if needed
        const [existingUn]: any = await pool.query(
            'SELECT id FROM users WHERE username = ? LIMIT 1',
            [finalUsername]
        );
        if (existingUn && existingUn.length > 0) {
            finalUsername = `${baseUsername}_${Math.random().toString(36).slice(2, 6)}`;
        }

        const id = randomUUID(); // varchar(36) UUID

        // In production: hash the password before saving
        // const passwordHash = await bcrypt.hash(password, 12);
        await pool.query(
            `INSERT INTO users (id, username, name, email, phone, password, plan, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 'free', NOW())`,
            [
                id,
                finalUsername,
                name.trim(),
                emailNorm,
                phone || null,
                password,
            ]
        );

        return NextResponse.json({
            success: true,
            user: {
                id,
                name: name.trim(),
                email: emailNorm,
                phone: phone || '',
                jobTitle: '',
                bio: '',
            },
        }, { status: 201 });

    } catch (err: any) {
        console.error('[auth/register]', err);
        return NextResponse.json({ error: err.message || 'Server error. Please try again.' }, { status: 500 });
    }
}
