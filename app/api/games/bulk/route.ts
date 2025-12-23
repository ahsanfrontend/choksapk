import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function verifyAdmin() {
    const token = (await cookies()).get('token')?.value;
    const payload = await verifyToken(token || '');
    return payload && payload.role === 'admin';
}

export async function DELETE(req: Request) {
    try {
        if (!(await verifyAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { ids } = await req.json();
        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
        }

        await dbConnect();
        await Game.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ message: 'Games deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete games' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        if (!(await verifyAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { ids, update } = await req.json();
        if (!Array.isArray(ids) || ids.length === 0 || !update) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await dbConnect();
        await Game.updateMany({ _id: { $in: ids } }, { $set: update });

        return NextResponse.json({ message: 'Games updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update games' }, { status: 500 });
    }
}
