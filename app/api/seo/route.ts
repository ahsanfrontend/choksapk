import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageMetadata from '@/models/PageMetadata';
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
        const metadata = await PageMetadata.find().sort({ routePath: 1 });
        return NextResponse.json({ metadata });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value;
        const auth = await verifyToken(token || '');
        if (!auth || auth.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // If ID exists, update, else create/upsert by path
        let data;
        if (body._id) {
            data = await PageMetadata.findByIdAndUpdate(body._id, body, { new: true });
        } else {
            // Check if path exists
            const existing = await PageMetadata.findOne({ routePath: body.routePath });
            if (existing) {
                data = await PageMetadata.findByIdAndUpdate(existing._id, body, { new: true });
            } else {
                data = await PageMetadata.create(body);
            }
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value;
        const auth = await verifyToken(token || '');
        if (!auth || auth.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        await dbConnect();
        await PageMetadata.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
