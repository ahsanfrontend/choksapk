import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Check if any super_admin already exists
        const adminExists = await User.findOne({ role: 'super_admin' });

        if (adminExists) {
            return NextResponse.json(
                { error: 'Initial setup already completed. Super admin exists.' },
                { status: 403 }
            );
        }

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'super_admin',
            status: 'active'
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user.toObject();

        return NextResponse.json({
            message: 'Super admin initialized successfully',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Setup Error:', error);
        return NextResponse.json(
            { error: 'Initialization failed' },
            { status: 500 }
        );
    }
}
