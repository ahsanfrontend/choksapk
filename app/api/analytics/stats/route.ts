import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import Redirect from '@/models/Redirect';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function verifyAdmin() {
    const token = (await cookies()).get('token')?.value;
    const payload = await verifyToken(token || '');
    return payload && payload.role === 'admin';
}

export async function GET() {
    try {
        if (!(await verifyAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // 1. Get total stats
        const totalVisits = await AnalyticsEvent.countDocuments({ eventType: 'visit' });
        const totalClicks = await AnalyticsEvent.countDocuments({ eventType: 'click' });
        const total404s = await AnalyticsEvent.countDocuments({ eventType: '404' });

        // 2. Get recent feed (Instant Feed)
        const recentEvents = await AnalyticsEvent.find()
            .sort({ timestamp: -1 })
            .limit(30);

        // 3. Get redirect data
        const redirects = await Redirect.find().sort({ clicks: -1 });

        // 3. Get traffic trajectory (last 7 days grouped by day)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trajectory = await AnalyticsEvent.aggregate([
            { $match: { timestamp: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    visits: { $sum: { $cond: [{ $eq: ["$eventType", "visit"] }, 1, 0] } },
                    clicks: { $sum: { $cond: [{ $eq: ["$eventType", "click"] }, 1, 0] } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        return NextResponse.json({
            totalVisits,
            totalClicks,
            total404s,
            recentEvents,
            trajectory,
            redirects
        });

    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
