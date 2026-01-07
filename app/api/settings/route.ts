import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function getAdminPayload() {
    const token = (await cookies()).get('token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) return null;
    return payload;
}

// Public endpoint for fetching settings (needed for metadata)
export async function GET() {
    try {
        await dbConnect();
        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create({
                siteName: 'choksapk',
                siteTagline: 'Premium Asset Distribution Protocol',
                socialLinks: {},
                homeBanners: [],
                primaryColor: '#DDA430',
                secondaryColor: '#101010',
                accentColor: '#E75153',
                maintenanceMode: false,
                registrationEnabled: true,
                commentsEnabled: true,
            });
        }

        // Return public-safe data (hide sensitive keys)
        const publicSettings = {
            ...settings.toObject(),
            openaiKey: undefined,
            geminiKey: undefined,
        };

        return NextResponse.json(publicSettings);
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return NextResponse.json({
            error: 'Failed to fetch settings',
            // Return defaults on error
            siteName: 'choksapk',
            siteTagline: 'Premium Asset Distribution Protocol',
            primaryColor: '#DDA430',
        }, { status: 500 });
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
        console.error('Failed to update settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
