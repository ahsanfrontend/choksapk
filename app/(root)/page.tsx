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
    let latestPosts = [];

    try {
        await dbConnect();

        // Fetch Featured Games
        featuredGames = await Game.find({ isFeatured: true, isActive: true }).limit(4);
        latestGames = await Game.find({ isActive: true }).sort({ createdAt: -1 }).limit(8);
        latestPosts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 }).limit(3);
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
        latestGames = Array(8).fill(null).map((_, i) => ({
            _id: `latest-mock-${i}`,
            title: `New Game ${i + 1}`,
            slug: `new-game-${i}`,
            thumbnail: `https://placehold.co/300x300/1e293b/ffffff?text=Game+${i + 1}`,
            provider: "Hacksaw Gaming"
        }));

        // Mock Blog Posts
        latestPosts = Array(3).fill(null).map((_, i) => ({
            _id: `post-mock-${i}`,
            title: `choksapk News Update ${i + 1}`,
            slug: `news-update-${i}`,
            excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            featuredImage: `https://placehold.co/600x400/1e293b/38bdf8?text=News+${i + 1}`,
            status: 'published'
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
                        <Link href="/games/slots" className="px-8 md:px-10 py-3.5 md:py-4 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-bold text-xs md:text-lg rounded-xl md:rounded-2xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest">
                            Browse Games
                        </Link>
                        <Link href="/blog" className="px-8 md:px-10 py-3.5 md:py-4 bg-background border-2 border-border text-foreground font-bold text-xs md:text-lg rounded-xl md:rounded-2xl transition-all hover:bg-muted active:scale-95 uppercase tracking-widest">
                            Latest News
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
                    <Link href="/games/slots" className="text-[9px] md:text-sm font-black text-primary hover:underline tracking-widest uppercase">VIEW ALL</Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {featuredGames.map(game => (
                        <Link href={`/game/${game.slug}`} key={game._id.toString()} className="group relative block aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden bg-muted border border-border hover:border-primary transition-all shadow-sm hover:shadow-2xl hover:-translate-y-2 duration-500">
                            <div className="w-full h-full">
                                {game.thumbnail ? (
                                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                                )}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 md:p-6 pt-12 md:pt-20">
                                <h3 className="text-white font-bold truncate text-xs md:text-base uppercase tracking-wide">{game.title}</h3>
                                <p className="text-[9px] md:text-xs text-primary font-black uppercase tracking-widest">{game.provider}</p>
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="px-6 md:px-8 py-2 md:py-3 bg-primary text-primary-foreground font-black rounded-xl md:rounded-2xl transform translate-y-8 group-hover:translate-y-0 transition duration-500 uppercase text-[10px] md:text-sm shadow-xl shadow-primary/40">Get Asset</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="bg-muted/30 py-16 md:py-20 border-y border-border">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl md:text-3xl font-black text-foreground mb-10 md:mb-12 uppercase tracking-tight border-l-8 border-primary pl-6">New Arrivals</h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
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

            {/* News Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-10 md:mb-14">
                        <h2 className="text-xl md:text-4xl font-black text-foreground uppercase tracking-tight italic">The choksapk <span className="text-primary not-italic">Journal</span></h2>
                        <Link href="/blog" className="hidden sm:block text-[10px] md:text-sm font-black text-primary hover:underline tracking-widest uppercase border-2 border-primary/20 px-4 py-2 rounded-full">Explore All</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                        {latestPosts.map(post => (
                            <div key={post._id.toString()} className="bg-card rounded-2xl md:rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 flex flex-col h-full group">
                                <div className="h-48 md:h-60 bg-muted relative overflow-hidden">
                                    {post.featuredImage && (
                                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover transition duration-1000 group-hover:scale-105" />
                                    )}
                                    <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black text-primary-foreground uppercase tracking-widest">Article</div>
                                </div>
                                <div className="p-6 md:p-8 flex-1 flex flex-col">
                                    <h3 className="text-lg md:text-xl font-black text-foreground mb-3 md:mb-4 line-clamp-2 leading-tight uppercase group-hover:text-primary transition-colors">{post.title}</h3>
                                    <p className="text-muted-foreground text-xs md:text-sm mb-6 md:mb-8 line-clamp-3 leading-relaxed font-medium">{post.excerpt}</p>
                                    <Link href={`/blog/${post.slug}`} className="text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-auto flex items-center gap-2 hover:gap-4 transition-all">
                                        Read Deep Dive <span className="text-lg md:text-xl leading-none">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );

}
