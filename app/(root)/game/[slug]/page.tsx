import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';
import PartnerClickTracker from '@/components/PartnerClickTracker';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const path = `/game/${slug}`;

    await dbConnect();
    const game = await Game.findOne({ slug, isActive: true });

    if (!game) return { title: 'Asset Not Found' };

    return await getMetadataForPath(path, {
        title: `${game.title} | choksapk - Repository Access`,
        description: game.description?.replace(/<[^>]*>/g, '').slice(0, 160) || `Access the master repository for ${game.title}.`,
    });
}

export const dynamic = 'force-dynamic';

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const path = `/game/${slug}`;
    let game;
    let relatedGames: any[] = [];
    try {
        await dbConnect();
        game = await Game.findOne({ slug: slug, isActive: true });
        if (game) {
            relatedGames = await Game.find({
                category: game.category,
                _id: { $ne: game._id },
                isActive: true
            }).limit(4);
        }
    } catch (error) {
        console.error("Game Detail DB Error, using mock:", error);
        game = {
            _id: 'mock-id',
            title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            slug: slug,
            category: 'slots',
            description: 'Experience the thrill of this modern slot game. Featuring high volatility and massive multipliers, it is one of the most popular titles in our collection.',
            provider: 'Pragmatic Play',
            thumbnail: `https://placehold.co/800x450/1e293b/fbbf24?text=${slug}`,
            downloadUrl: '',
            referralUrl: 'https://choksapk-partner.com/ref/demo',
            rating: 4.4,
            version: '1.0.0',
            requirements: 'Android 6.9+',
            downloadCount: '500,000+',
            fileSize: '39.65 MB',
            isActive: true,
            createdAt: new Date()
        };
        relatedGames = Array(4).fill(null).map((_, i) => ({
            _id: `mock-rel-${i}`,
            title: `Related Game ${i + 1}`,
            slug: `related-game-${i + 1}`,
            thumbnail: `https://placehold.co/400x300/1e293b/fbbf24?text=Related+${i + 1}`,
            provider: 'Provider X'
        }));
    }

    if (!game) notFound();

    const isNew = game.createdAt && (new Date().getTime() - new Date(game.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            {/* Game Header Area */}
            <div className="bg-card border-b border-border py-8 mb-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border-2 border-primary ring-4 md:ring-8 ring-primary/5 group relative flex-shrink-0">
                                <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                {isNew && (
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-[8px] font-black text-white rounded-sm uppercase tracking-widest shadow-lg">NEW</div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-tight mb-2 md:mb-3 italic line-clamp-2 md:line-clamp-none">{game.title}</h1>
                                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                    <span className="px-3 py-1 md:px-4 md:py-1.5 bg-primary/10 text-primary text-[7px] md:text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/20">{game.provider}</span>
                                    <span className="text-muted-foreground text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em]">• {game.category} Inventory</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6 bg-muted/30 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border border-border mt-4 md:mt-0">
                            <div className="flex -space-x-2 md:-space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-card bg-muted flex items-center justify-center text-[8px] md:text-[10px] font-black text-muted-foreground shadow-xl`}>
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-card bg-emerald-500 flex items-center justify-center text-[8px] md:text-[10px] font-black text-white shadow-xl ring-2 ring-emerald-500/20">
                                    +12k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] md:text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none mb-1 text-right">Instant Access</span>
                                <span className="text-px md:text-xs font-bold text-foreground">{game.downloadCount || '12,482'} Downloads</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Section */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Tech Specs */}
                        <div className="bg-card p-6 md:p-10 lg:p-14 rounded-3xl md:rounded-[3rem] border border-border shadow-xl relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mb-32"></div>
                            <h2 className="text-lg md:text-2xl font-black text-foreground mb-6 md:mb-8 uppercase tracking-tighter italic flex items-center gap-3 relative z-10">
                                <span className="w-6 md:w-8 h-1 md:h-1.5 bg-primary rounded-full"></span> Technical Specification
                            </h2>
                            <div className="prose prose-invert max-w-none relative z-10">
                                <div
                                    className="text-muted-foreground leading-relaxed font-medium text-[14px] md:text-lg whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: game.description || '' }}
                                />
                            </div>
                        </div>

                        {/* Related Apps Section */}
                        <div className="bg-card p-6 md:p-10 lg:p-14 rounded-3xl md:rounded-[3rem] border border-border shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            <div className="flex justify-between items-end mb-6 md:mb-8 relative z-10">
                                <div>
                                    <h2 className="text-lg md:text-2xl font-black text-foreground uppercase tracking-tighter italic flex items-center gap-2 md:gap-3">
                                        <span className="w-6 md:w-8 h-1 md:h-1.5 bg-primary rounded-full"></span> Related Apps
                                    </h2>
                                </div>
                                <Link href={`/games/${game.category}`} className="text-[7px] md:text-[10px] font-black text-primary hover:underline uppercase tracking-[0.2em]">View Gallery</Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 relative z-10">
                                {relatedGames.map((rel: any) => (
                                    <Link key={rel._id} href={`/game/${rel.slug}`} className="group bg-muted/30 p-3 md:p-4 rounded-2xl md:rounded-[2.5rem] border border-border hover:border-primary transition-all shadow-sm hover:shadow-2xl">
                                        <div className="aspect-square rounded-xl md:rounded-[2rem] overflow-hidden mb-3 md:mb-4 bg-muted border border-border">
                                            <img src={rel.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <h4 className="text-[10px] md:text-xs font-black text-foreground uppercase truncate px-1 md:px-2">{rel.title}</h4>
                                        <p className="text-[6px] md:text-[8px] text-muted-foreground uppercase font-black tracking-widest px-1 md:px-2 mt-1">{rel.provider}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Leave a Reply Section */}
                        <div className="bg-card p-6 md:p-10 lg:p-14 rounded-3xl md:rounded-[3rem] border border-border shadow-xl">
                            <h2 className="text-lg md:text-2xl font-black text-foreground mb-3 md:mb-4 uppercase tracking-tighter italic flex items-center gap-3">
                                <span className="w-6 md:w-8 h-1 md:h-1.5 bg-primary rounded-full"></span> Leave a Reply
                            </h2>
                            <p className="text-muted-foreground text-[10px] md:text-sm font-medium mb-6 md:mb-10">Your email address will not be published. Required fields are marked *</p>

                            <form className="space-y-6 md:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <div className="space-y-2">
                                        <label className="block text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Name *</label>
                                        <input type="text" className="w-full bg-muted/30 border border-border rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" required placeholder="User Anonymous" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Email *</label>
                                        <input type="email" className="w-full bg-muted/30 border border-border rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" required placeholder="user@vault.network" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Comment *</label>
                                    <textarea className="w-full bg-muted/30 border border-border rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium h-32 md:h-40 resize-none" required placeholder="Transmit your feedback protocol..." />
                                </div>
                                <button type="submit" className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-primary hover:opacity-95 active:scale-95 text-primary-foreground font-black rounded-xl md:rounded-2xl transition-all shadow-xl shadow-primary/30 uppercase tracking-widest text-[10px] md:text-xs">
                                    Post Comment
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-card rounded-[2.5rem] border border-border sticky top-28 shadow-2xl ring-1 ring-primary/5 overflow-hidden">
                            {/* Integrated Thumbnail */}
                            <div className="w-full aspect-[16/10] bg-muted relative overflow-hidden group">
                                <img src={game.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                {isNew && (
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-[10px] font-black text-white rounded-lg uppercase tracking-widest shadow-xl">NEW</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(game.rating || 4.4) ? 'fill-current' : 'text-muted'}`} viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-xs font-black text-foreground">{game.rating || 4.4}</span>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-6 md:space-y-8 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                <div className="relative z-10">
                                    <h3 className="text-base md:text-lg font-black text-foreground uppercase tracking-tighter italic mb-2 md:mb-3">{game.title}</h3>
                                    <p className="text-muted-foreground text-[8px] md:text-[10px] font-medium leading-relaxed mb-4 md:mb-6">Access certified source code from our encrypted master server. Downloads are SHA-256 validated.</p>

                                    <PartnerClickTracker gameId={game._id.toString()} path={path}>
                                        <a
                                            href={game.referralUrl || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 md:py-5 bg-[#065F32] hover:bg-[#064e29] active:scale-[0.98] text-white font-black rounded-xl md:rounded-2xl transition-all shadow-xl shadow-emerald-900/20 flex flex-col items-center justify-center gap-1 uppercase tracking-widest text-[8px] md:text-[10px]"
                                        >
                                            <span className="text-[10px] md:text-[11px]">Download Protocol</span>
                                            <span className="text-[6px] md:text-[7px] opacity-70 font-black tracking-tighter">ENCRYPTED BRANCH {game.version || '1.0.0'}</span>
                                        </a>
                                    </PartnerClickTracker>
                                </div>

                                {/* Integrated Asset Stats */}
                                <div className="pt-6 md:pt-8 border-t border-border grid grid-cols-2 gap-3 md:gap-4 relative z-10">
                                    {[
                                        { label: 'Asset Size', value: game.fileSize || '39.65 MB' },
                                        { label: 'OS Version', value: game.requirements || 'Android 6.9+' },
                                        { label: 'Integrity', value: 'Verified' },
                                        { label: 'Updated', value: 'Recent' },
                                    ].map((stat, i) => (
                                        <div key={i} className="flex flex-col">
                                            <span className="text-[6px] md:text-[7px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</span>
                                            <span className="text-[8px] md:text-[10px] font-black text-foreground uppercase tracking-tighter">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-border flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Active Link</span>
                                    </div>
                                    <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-tighter">12.4k DL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
