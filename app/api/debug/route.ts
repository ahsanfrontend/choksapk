import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
    try {
        // Attempt database connection
        await dbConnect();

        // Check environment variables (without exposing them)
        const hasMongoUri = !!process.env.MONGODB_URI;
        const hasJwtSecret = !!process.env.JWT_SECRET;

        return NextResponse.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            hasMongoUri,
            hasJwtSecret,
            mongoUriPrefix: process.env.MONGODB_URI?.substring(0, 20) + '...',
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET,
        }, { status: 500 });
    }
}
