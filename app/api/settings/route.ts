import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function getAdminPayload() {
    const token = (await cookies()).get('token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return null;
    return payload;
}

export async function GET() {
    const admin = await getAdminPayload();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({
                siteName: 'choksapk',
                socialLinks: { facebook: '', twitter: '', instagram: '' },
                homeBanners: []
            });
        }
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const admin = await getAdminPayload();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const data = await req.json();
        await dbConnect();

        const settings = await SiteSettings.findOneAndUpdate(
            {},
            { ...data },
            { new: true, upsert: true }
        );

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
