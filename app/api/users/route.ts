import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

async function getAdminPayload() {
    const token = (await cookies()).get('token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) return null;
    return payload;
}

export async function GET() {
    const admin = await getAdminPayload();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        await dbConnect();
        // Super admin sees all, admin sees all for now (manage standard users)
        const users = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const admin = await getAdminPayload();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, email, role, status, password } = await req.json();

        // --- Hierarchy Logic ---
        // 1. Admin can ONLY create 'user' (limited users)
        if (admin.role === 'admin' && role !== 'user') {
            return NextResponse.json({ error: 'Admins can only create limited users' }, { status: 403 });
        }
        // 2. Super Admin can create anyone (admin, user)

        await dbConnect();

        // Check for existing
        const existing = await User.findOne({ email });
        if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const user = await User.create({
            name,
            email,
            role,
            status,
            password: hashedPassword
        });

        // Don't return password in response
        const { password: _, ...userWithoutPassword } = user.toObject();

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('User Create Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
