import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventType, path, entityId, entityType } = body;

        if (!eventType || !path || !entityType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const head = await headers();
        const ip = head.get('x-forwarded-for') || 'unknown';
        const userAgent = head.get('user-agent') || 'unknown';

        await dbConnect();
        await AnalyticsEvent.create({
            eventType,
            path,
            entityId,
            entityType,
            ip,
            userAgent
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
    }
}
