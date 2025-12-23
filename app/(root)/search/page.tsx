import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import BlogPost from '@/models/BlogPost';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q: string }> }): Promise<Metadata> {
    const { q } = await searchParams;
    return await getMetadataForPath('/search', {
        title: q ? `Search: "${q}" | choksapk` : 'Search Assets | choksapk',
        description: `Discovery results for ${q || 'premium gaming assets'}.`
    });
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const q = (await searchParams).q || '';
    let games: any[] = [];
    let blogs: any[] = [];

    if (q) {
        try {
            await dbConnect();

            // Search games
            games = await Game.find({
                isActive: true,
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } },
                    { provider: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } }
                ]
            }).limit(10);

            // Search blogs
            blogs = await BlogPost.find({
                status: 'published',
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { content: { $regex: q, $options: 'i' } },
                    { excerpt: { $regex: q, $options: 'i' } }
                ]
            }).limit(5);

        } catch (error) {
            console.error("Search Error:", error);
        }
    }

    return (
        <div className="bg-background min-h-screen py-16 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter italic mb-4">
                        Search Results: <span className="text-primary not-italic">"{q}"</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-primary rounded-full mb-8"></div>
                    <p className="text-muted-foreground font-medium">
                        Found {games.length} assets and {blogs.length} articles matching your query.
                    </p>
                </div>

                {/* Games Results */}
                <section className="mb-20">
                    <h2 className="text-xl font-bold text-foreground mb-8 uppercase tracking-widest flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span> Gaming Assets
                    </h2>
                    {games.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                            {games.map(game => (
                                <Link href={`/game/${game.slug}`} key={game._id.toString()} className="group relative block aspect-[3/4.2] rounded-2xl md:rounded-3xl overflow-hidden bg-card border border-border hover:border-primary transition-all shadow-sm hover:shadow-2xl hover:-translate-y-1 duration-500">
                                    <div className="w-full h-full">
                                        <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 md:p-6 pt-12 md:pt-16">
                                        <h3 className="text-white font-bold truncate text-sm md:text-base uppercase tracking-wide leading-none mb-2">{game.title}</h3>
                                        <p className="text-[8px] md:text-[10px] text-primary font-black uppercase tracking-[0.2em]">{game.provider}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                        <span className="px-6 py-2.5 bg-primary text-primary-foreground font-black rounded-xl transform translate-y-4 group-hover:translate-y-0 transition duration-500 uppercase text-xs shadow-xl shadow-primary/40">Access Asset</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-muted/10 rounded-3xl border border-dashed border-border text-muted-foreground font-bold uppercase text-sm tracking-widest">
                            No gaming assets found for this query.
                        </div>
                    )}
                </section>

                {/* Blogs Results */}
                <section>
                    <h2 className="text-xl font-bold text-foreground mb-8 uppercase tracking-widest flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span> Intelligence Journal
                    </h2>
                    {blogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {blogs.map(post => (
                                <Link href={`/blog/${post.slug}`} key={post._id.toString()} className="bg-card p-6 rounded-3xl border border-border hover:border-primary/50 transition-all flex gap-6 group">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-muted">
                                        <img src={post.featuredImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h3 className="text-base md:text-lg font-black text-foreground uppercase tracking-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">{post.title}</h3>
                                        <p className="text-muted-foreground text-xs font-medium mb-3 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                        <span className="text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Read Protocol &rarr;</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-muted/10 rounded-3xl border border-dashed border-border text-muted-foreground font-bold uppercase text-sm tracking-widest">
                            No journal articles found for this query.
                        </div>
                    )}
                </section>

                {!q && (
                    <div className="text-center py-24">
                        <p className="text-muted-foreground font-black text-2xl uppercase tracking-[0.2em] mb-8 italic">Specify Query Protocol</p>
                        <Link href="/" className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-xs shadow-xl shadow-primary/30">
                            Return to Base
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
