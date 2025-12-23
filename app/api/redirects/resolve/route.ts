import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Redirect from '@/models/Redirect';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const path = searchParams.get('path');

        if (!path) return NextResponse.json(null);

        await dbConnect();
        const redirect = await Redirect.findOne({ sourcePath: path, isActive: true });

        if (redirect) {
            // Background update of clicks
            Redirect.findByIdAndUpdate(redirect._id, {
                $inc: { clicks: 1 },
                $set: { lastAccessed: new Date() }
            }).exec();

            return NextResponse.json({
                destinationPath: redirect.destinationPath,
                type: redirect.type
            });
        }

        return NextResponse.json(null);
    } catch (error) {
        return NextResponse.json(null);
    }
}
