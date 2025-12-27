import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import SEOMetadata from '@/models/SEOMetadata';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const headersList = await headers();
        const token = headersList.get('authorization')?.split(' ')[1];

        if (!token || !(await verifyToken(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();
        await dbConnect();

        const seoRoute = await SEOMetadata.findByIdAndUpdate(id, data, { new: true });

        if (!seoRoute) {
            return NextResponse.json({ error: 'SEO Route not found' }, { status: 404 });
        }

        return NextResponse.json(seoRoute);
    } catch (error: any) {
        console.error('SEO Route PUT Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const headersList = await headers();
        const token = headersList.get('authorization')?.split(' ')[1];

        if (!token || !(await verifyToken(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();

        const seoRoute = await SEOMetadata.findByIdAndDelete(id);

        if (!seoRoute) {
            return NextResponse.json({ error: 'SEO Route not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'SEO Route deleted' });
    } catch (error: any) {
        console.error('SEO Route DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
