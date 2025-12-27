import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        await dbConnect();

        const suggestions = await Game.find({
            isActive: true,
            title: { $regex: query, $options: 'i' }
        })
            .select('title slug thumbnail provider')
            .limit(5);

        return NextResponse.json(suggestions);
    } catch (error) {
        console.error('Search Suggestions Error:', error);
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}
