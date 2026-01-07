import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const token = req.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { code } = await req.json();
        if (!code) return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });

        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (!user.verificationCode || !user.verificationCodeExpires || !user.pendingName) {
            return NextResponse.json({ error: 'No pending name change request' }, { status: 400 });
        }

        if (user.verificationCode !== code) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        if (new Date() > user.verificationCodeExpires) {
            return NextResponse.json({ error: 'Verification code expired' }, { status: 400 });
        }

        // Update name and clear verification fields
        user.name = user.pendingName;
        user.pendingName = undefined;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        return NextResponse.json({ success: true, message: 'Username updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
