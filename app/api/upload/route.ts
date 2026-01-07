import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value;
        const payload = await verifyToken(token || '');
        const isAdmin = payload && (payload.role === 'admin' || payload.role === 'super_admin');

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP, SVG, ICO) are allowed.'
            }, { status: 400 });
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'File too large. Maximum size is 10MB.'
            }, { status: 400 });
        }

        // Create unique filename
        const fileExtension = file.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

        // Check if running on Vercel (use Blob storage)
        if (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL) {
            try {
                const blob = await put(filename, file, {
                    access: 'public',
                    addRandomSuffix: false,
                });

                return NextResponse.json({
                    url: blob.url,
                    filename: filename,
                    provider: 'vercel-blob'
                });
            } catch (blobError: any) {
                console.error('Vercel Blob error:', blobError);
                return NextResponse.json({
                    error: 'Failed to upload to Vercel Blob. Please ensure BLOB_READ_WRITE_TOKEN is set in your environment variables.',
                    details: process.env.NODE_ENV === 'development' ? blobError.message : undefined
                }, { status: 500 });
            }
        }

        // Local development: use filesystem
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = path.join(process.cwd(), 'public/uploads');

            // Ensure directory exists
            await mkdir(uploadDir, { recursive: true });

            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);

            const url = `/uploads/${filename}`;
            return NextResponse.json({
                url,
                filename,
                provider: 'local'
            });
        } catch (fsError: any) {
            console.error('File system error:', fsError);
            throw fsError;
        }
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: error.message || 'Upload failed',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
