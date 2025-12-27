import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/games', {
        title: 'All Gaming Assets | choksapk',
        description: 'Explore our complete repository of premium gaming assets and titles.'
    });
}

export const dynamic = 'force-dynamic';

export default async function AllGamesPage() {
    let games = [];
    try {
        await dbConnect();
        games = await Game.find({ isActive: true }).sort({ createdAt: -1 });
    } catch (error) {
        console.error("Failed to fetch games, using mock data:", error);
        games = Array(15).fill(null).map((_, i) => ({
            _id: `mock-${i}`,
            title: `Demo Game ${i + 1}`,
            slug: `demo-game-${i + 1}`,
            thumbnail: `https://placehold.co/400x600/1e293b/fbbf24?text=Game+${i + 1}`,
            provider: "Demo Provider",
            category: "mixed"
        }));
    }

    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4">
                <div className="mb-12 md:mb-20">
                    <h1 className="text-3xl md:text-6xl font-black text-foreground mb-4 capitalize tracking-tighter italic">
                        The Master <span className="text-primary italic">Vault</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-primary rounded-full mb-6 md:mb-8"></div>
                    <p className="text-muted-foreground max-w-2xl font-medium text-sm md:text-lg leading-relaxed">
                        Access our complete collection of premium gaming assets. High-performance repository for elite gaming discovery.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {games.map(game => (
                        <Link href={`/game/${game.slug}`} key={game._id.toString()} className="group relative block aspect-[3/4.2] rounded-3xl overflow-hidden bg-card border border-border hover:border-primary transition-all shadow-sm hover:shadow-2xl hover:-translate-y-2 duration-500">
                            <div className="w-full h-full">
                                {game.thumbnail ? (
                                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">No Image</div>
                                )}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 md:p-6 pt-12 md:pt-16">
                                <h3 className="text-white font-bold truncate text-sm md:text-base uppercase tracking-wide leading-none mb-1 md:mb-2">{game.title}</h3>
                                <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">{game.provider}</p>
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-2xl transform translate-y-8 group-hover:translate-y-0 transition duration-500 uppercase text-sm shadow-xl shadow-primary/40">Get Asset</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {games.length === 0 && (
                    <div className="text-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border mt-12">
                        <p className="text-muted-foreground font-black text-2xl uppercase tracking-[0.2em] mb-8">Empty Chambers</p>
                        <Link href="/" className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
                            Return to Base
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
