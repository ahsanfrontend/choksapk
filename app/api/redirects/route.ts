import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function verifyAdmin() {
    const token = (await cookies()).get('token')?.value;
    const payload = await verifyToken(token || '');
    return payload && (payload.role === 'admin' || payload.role === 'super_admin');
}

export async function GET() {
    try {
        if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await dbConnect();
        const redirects = await Redirect.find().sort({ createdAt: -1 });
        return NextResponse.json(redirects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { sourcePath, destinationPath, type } = await req.json();
        await dbConnect();
        const redirect = await Redirect.create({ sourcePath, destinationPath, type });
        return NextResponse.json(redirect);
    } catch (error) {
        return NextResponse.json({ error: 'Duplicate or invalid path' }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    try {
        if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { id } = await req.json();
        await dbConnect();
        await Redirect.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
