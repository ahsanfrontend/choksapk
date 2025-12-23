import Link from 'next/link';
import mongoose from 'mongoose';
import GameForm from '@/components/admin/GameForm';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-black text-foreground uppercase tracking-tighter italic">Invalid <span className="text-destructive italic">Protocol</span></h1>
                <p className="text-muted-foreground text-sm font-medium">The requested asset identifier is malformed or invalid.</p>
                <Link href="/admin/games" className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl uppercase tracking-widest text-xs hover:opacity-90 transition-all">
                    Return to Library
                </Link>
            </div>
        );
    }

    const game = await Game.findById(id);

    if (!game) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h1 className="text-2xl font-black text-foreground uppercase tracking-tighter italic">Asset <span className="text-destructive italic">Not Found</span></h1>
            <p className="text-muted-foreground text-sm font-medium">The requested identifier does not exist in the master repository.</p>
            <Link href="/admin/games" className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl uppercase tracking-widest text-xs hover:opacity-90 transition-all">
                Return to Library
            </Link>
        </div>
    );

    const gameObj = JSON.parse(JSON.stringify(game));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Reconfigure <span className="text-primary italic">Asset</span></h1>
                <p className="text-muted-foreground text-sm font-medium mt-1">Executing modification protocol for: {game.title}</p>
            </div>
            <GameForm initialData={gameObj} />
        </div>
    );
}
