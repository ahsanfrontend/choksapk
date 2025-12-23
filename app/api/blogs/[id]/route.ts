import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();
        const post = await BlogPost.findOne({
            $or: [{ _id: id }, { slug: id }]
        }).populate('author', 'name');

        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        return NextResponse.json({ post });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const token = (await cookies()).get('token')?.value;
        const payload = await verifyToken(token || '');
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const post = await BlogPost.findByIdAndUpdate(id, body, { new: true });

        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        return NextResponse.json({ post });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const token = (await cookies()).get('token')?.value;
        const payload = await verifyToken(token || '');
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const post = await BlogPost.findByIdAndDelete(id);

        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        return NextResponse.json({ message: 'Post deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
