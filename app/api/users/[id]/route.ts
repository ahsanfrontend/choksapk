import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function getAdminPayload() {
    const token = (await cookies()).get('token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) return null;
    return payload;
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await getAdminPayload();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        const { id } = await params;
        await dbConnect();

        // Check if user exists
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Hierarchy Check
        // 1. Super Admin can delete anyone except themselves (or maybe they can, but we should be careful)
        // 2. Admin can ONLY delete standard users
        if (admin.role === 'admin' && userToDelete.role !== 'user') {
            return NextResponse.json({ error: 'Admins can only delete limited users' }, { status: 403 });
        }

        // Prevent self-deletion via this endpoint for safety (optional)
        if (admin.userId === id) {
            return NextResponse.json({ error: 'Self-deletion restricted via protocol' }, { status: 403 });
        }

        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await getAdminPayload();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        const { id } = await params;
        const body = await req.json();
        await dbConnect();

        const userToUpdate = await User.findById(id);
        if (!userToUpdate) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Hierarchy Check
        if (admin.role === 'admin' && userToUpdate.role !== 'user') {
            return NextResponse.json({ error: 'Admins can only modify limited users' }, { status: 403 });
        }

        // Apply updates
        const updated = await User.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
