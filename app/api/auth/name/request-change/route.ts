import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { sendEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const token = req.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { newName } = await req.json();
        if (!newName) return NextResponse.json({ error: 'New name is required' }, { status: 400 });

        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Generate code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        user.verificationCode = code;
        user.verificationCodeExpires = expires;
        user.pendingName = newName;
        await user.save();

        const mailResult = await sendEmail({
            to: user.email,
            subject: 'Username Change Verification',
            text: `Your verification code is: ${code}.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">Identity Verification</h2>
                    <p>You requested to change your administrative name to: <strong>${newName}</strong></p>
                    <p>Use the code below to authorize this change:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #DDA430; margin: 20px 0;">${code}</div>
                    <p style="color: #666; font-size: 12px;">This code will expire in 15 minutes.</p>
                </div>
            `
        });

        if (!mailResult.success) {
            return NextResponse.json({ error: `Mail Delivery Failed: ${mailResult.error}` }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: mailResult.simulated ? 'SIMULATION: Check console for code' : 'Verification code sent to your email'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
