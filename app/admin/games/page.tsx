import Link from 'next/link';
import { Plus } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import GamesDashboard from '@/components/admin/GamesDashboard';

export const dynamic = 'force-dynamic';

export default async function GamesAdminPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let games: any[] = [];
    try {
        await dbConnect();
        // Plain objects for client component
        const dbGames = await Game.find({}).sort({ createdAt: -1 });
        games = JSON.parse(JSON.stringify(dbGames));
    } catch (error) {
        console.error("Admin Games List DB Error, using mock data:", error);
        games = Array(5).fill(null).map((_, i) => ({
            _id: `mock-admin-game-${i}`,
            title: `Demo Game ${i + 1}`,
            slug: `demo-game-${i + 1}`,
            category: 'slots',
            provider: 'Demo Provider',
            thumbnail: '',
            description: '',
            isFeatured: i === 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0
        }));
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Vault <span className="text-primary italic">Inventory</span></h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Manage and curate your collection of choksapk assets.</p>
                </div>
                <Link href="/admin/games/new" className="px-8 py-3 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 transition-all">
                    <Plus size={18} /> Add New Title
                </Link>
            </div>

            <GamesDashboard initialGames={games} />
        </div>
    );
}

