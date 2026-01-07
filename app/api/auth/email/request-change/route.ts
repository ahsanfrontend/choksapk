import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { sendEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const token = req.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { newEmail } = await req.json();
        if (!newEmail) return NextResponse.json({ error: 'New email is required' }, { status: 400 });

        // Check if email is already in use
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });

        // Generate a 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await User.findByIdAndUpdate(decoded.userId, {
            verificationCode: code,
            verificationCodeExpires: expires,
            pendingEmail: newEmail
        });

        const mailResult = await sendEmail({
            to: newEmail,
            subject: 'Email Change Verification Code',
            text: `Your verification code is: ${code}. It will expire in 15 minutes.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">Verification Code</h2>
                    <p>You requested to change your email to this address. Use the code below to verify:</p>
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
            message: mailResult.simulated ? 'SIMULATION MODE: Check server console for code' : 'Verification code sent'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
