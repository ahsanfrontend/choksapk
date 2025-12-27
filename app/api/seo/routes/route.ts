import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import SEOMetadata from '@/models/SEOMetadata';

export async function GET() {
    try {
        const headersList = await headers();
        const token = headersList.get('authorization')?.split(' ')[1];

        if (!token || !(await verifyToken(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const seoRoutes = await SEOMetadata.find().sort({ route: 1 });
        return NextResponse.json(seoRoutes);
    } catch (error) {
        console.error('SEO Routes GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch SEO routes' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const headersList = await headers();
        const token = headersList.get('authorization')?.split(' ')[1];

        if (!token || !(await verifyToken(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        await dbConnect();

        const seoRoute = await SEOMetadata.create(data);
        return NextResponse.json(seoRoute, { status: 201 });
    } catch (error: any) {
        console.error('SEO Route POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
