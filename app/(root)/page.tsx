import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import BlogPost from '@/models/BlogPost';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/', {
        title: 'Home | choksapk - Ultimate Asset Vault',
        description: 'Discover premium gaming assets and referral codes.'
    });
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    let featuredGames = [];
    let latestGames = [];

    try {
        await dbConnect();

        // Fetch Featured Games (Editor's Choice) - 4 games
        featuredGames = await Game.find({ isFeatured: true, isActive: true }).limit(4);
        // Fetch Latest Games (New Arrivals) - 4 games
        latestGames = await Game.find({ isActive: true }).sort({ createdAt: -1 }).limit(4);
    } catch (error) {
        console.error("Homepage DB Error, utilizing mock data:", error);

        // Mock Featured Games
        featuredGames = Array(4).fill(null).map((_, i) => ({
            _id: `feat-mock-${i}`,
            title: `Epic Slot ${i + 1}`,
            slug: `epic-slot-${i}`,
            thumbnail: `https://placehold.co/400x600/1e293b/fbbf24?text=Featured+${i + 1}`,
            provider: "Pragmatic Play",
            isFeatured: true
        }));

        // Mock Latest Games
        latestGames = Array(4).fill(null).map((_, i) => ({
            _id: `latest-mock-${i}`,
            title: `New Game ${i + 1}`,
            slug: `new-game-${i}`,
            thumbnail: `https://placehold.co/300x300/1e293b/ffffff?text=Game+${i + 1}`,
            provider: "Hacksaw Gaming"
        }));
    }

    return (
        <div className="bg-background transition-colors duration-300 pb-12">
            {/* Hero Section */}
            <section className="relative min-h-[400px] md:h-[500px] flex items-center justify-center bg-muted/30 overflow-hidden border-b border-border py-12 md:py-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5"></div>
                <div className="absolute -top-24 -left-24 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-foreground mb-4 md:mb-6 uppercase tracking-tighter leading-none italic">
                        World Class <span className="text-primary not-italic">choksapk</span> Assets
                    </h1>
                    <p className="text-sm md:text-2xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                        Discover and deploy the best gaming assets from top-tier providers. Instant access to premium repositories.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                        <Link href="/games" className="px-8 md:px-10 py-3.5 md:py-4 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-bold text-xs md:text-lg rounded-xl md:rounded-2xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest">
                            Browse All Games
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Games */}
            <section className="container mx-auto px-4 py-12 md:py-20">
                <div className="flex justify-between items-end mb-8 md:mb-12">
                    <div>
                        <h2 className="text-xl md:text-4xl font-black text-foreground uppercase tracking-tight leading-none mb-2 italic">Editor's Choice</h2>
                        <div className="h-1 md:h-1.5 w-12 md:w-20 bg-primary rounded-full"></div>
                    </div>
                    <Link href="/games" className="text-[9px] md:text-sm font-black text-primary hover:underline tracking-widest uppercase">VIEW ALL</Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {featuredGames.map(game => (
                        <Link href={`/game/${game.slug}`} key={game._id.toString()} className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all shadow-sm hover:shadow-lg">
                            <div className="aspect-square bg-muted relative overflow-hidden">
                                {game.thumbnail ? (
                                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                                )}
                            </div>
                            <div className="p-4">
                                <h4 className="text-foreground text-[10px] md:text-xs font-black truncate uppercase tracking-tight">{game.title}</h4>
                                <p className="text-[9px] md:text-xs text-primary font-black uppercase tracking-widest mt-1">{game.provider}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="bg-muted/30 py-16 md:py-20 border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-10 md:mb-12">
                        <h2 className="text-xl md:text-3xl font-black text-foreground uppercase tracking-tight border-l-8 border-primary pl-6">New Arrivals</h2>
                        <Link href="/games" className="text-[9px] md:text-sm font-black text-primary hover:underline tracking-widest uppercase">VIEW ALL</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {latestGames.map(game => (
                            <Link href={`/game/${game.slug}`} key={game._id.toString()} className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all shadow-sm hover:shadow-lg">
                                <div className="aspect-square bg-muted relative overflow-hidden">
                                    {game.thumbnail && <img src={game.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />}
                                </div>
                                <div className="p-4">
                                    <h4 className="text-foreground text-[10px] md:text-xs font-black truncate uppercase tracking-tight">{game.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );

}
