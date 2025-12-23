import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
        if (status) query.status = status;
        else query.status = 'published'; // Default to published for public

        // Admin can see all if not specified, but usually we filter.
        // Ideally check auth to reveal drafts.
        // For simplicity, let's just return what is asked, assuming frontend handles filtering.
        // But security-wise, draft should only be visible to admin.

        const token = (await cookies()).get('token')?.value;
        const auth = token ? await verifyToken(token) : null;
        const isAdmin = auth?.role === 'admin';

        if (!isAdmin && query.status !== 'published') {
            query.status = 'published';
        }

        const posts = await BlogPost.find(query).sort({ createdAt: -1 }).populate('author', 'name');
        return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value;
        const payload = await verifyToken(token || '');
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Assign author
        body.author = payload.userId;

        const post = await BlogPost.create(body);
        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
