import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password || ''))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (user.status === 'blocked') {
            return NextResponse.json({ error: 'User is blocked' }, { status: 403 });
        }

        const token = await signToken({ userId: user._id.toString(), role: user.role });

        (await cookies()).set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({
            message: 'Login successful',
            token, // Return token for client-side storage
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
