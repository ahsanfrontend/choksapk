import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/metadata';
import { Search, Sparkles, Filter, LayoutGrid } from 'lucide-react';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q: string }> }): Promise<Metadata> {
    const { q } = await searchParams;
    const settings = await getSiteSettings();
    const siteName = settings?.siteName || 'choksapk';
    return await getMetadataForPath('/search', {
        title: q ? `${q} - Search Results | ${siteName}` : `Search Assets | ${siteName}`,
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
    const settings = await getSiteSettings();
    const uiDesign = settings?.uiDesign || 'vip';

    if (q) {
        try {
            await dbConnect();
            games = await Game.find({
                isActive: true,
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } },
                    { provider: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } }
                ]
            }).limit(20);
        } catch (error) {
            console.error("Search Error:", error);
        }
    }

    return (
        <div className={`min-h-screen py-20 transition-colors duration-500 ${uiDesign === 'vip' ? 'bg-[#050505] relative overflow-hidden' : 'bg-background'
            }`}>
            {uiDesign === 'vip' && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
                </div>
            )}

            <div className="container mx-auto px-6 relative z-10">
                <div className={`mb-16 transition-all duration-700 ${uiDesign === 'vip' ? 'text-center' : ''}`}>
                    {uiDesign === 'vip' && (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.34em] mb-6 shadow-glow">
                            <Search size={14} /> Discovery Matrix
                        </div>
                    )}
                    <h1 className={`text-foreground uppercase tracking-tighter italic mb-4 leading-tight font-black ${uiDesign === 'vip' ? 'text-5xl md:text-7xl' : 'text-3xl md:text-5xl'
                        }`}>
                        {uiDesign === 'vip' ? 'Matrix' : 'Search'} Results: <span className="text-primary not-italic">"{q}"</span>
                    </h1>
                    <div className={`h-1.5 bg-primary rounded-full mb-8 ${uiDesign === 'vip' ? 'w-48 mx-auto' : 'w-24'}`}></div>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-80">
                        Synthesized {games.length} entry points matching your query protocol.
                    </p>
                </div>

                {/* Games Results */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-black text-foreground uppercase tracking-widest flex items-center gap-4 italic leading-none">
                            <span className="w-2 h-8 bg-primary rounded-full shadow-glow"></span>
                            {uiDesign === 'vip' ? 'ASSET COMPILATION' : 'Gaming Assets'}
                        </h2>
                        {uiDesign === 'vip' && (
                            <div className="flex gap-2">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                                    <LayoutGrid size={18} />
                                </div>
                            </div>
                        )}
                    </div>

                    {games.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
                            {games.map(game => (
                                <Link
                                    href={`/game/${game.slug}`}
                                    key={game._id.toString()}
                                    className={`group relative block aspect-[3/4.2] overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-700 hover:-translate-y-2 ${uiDesign === 'vip' ? 'rounded-[2.5rem] shadow-2xl' : uiDesign === 'modern' ? 'rounded-3xl shadow-xl' : 'rounded-2xl shadow-md'
                                        }`}
                                >
                                    <div className="w-full h-full relative">
                                        {game.thumbnail ? (
                                            <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <Sparkles className="text-primary/20" size={48} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                                            <h3 className="text-white font-black truncate text-sm md:text-base uppercase tracking-tighter italic leading-tight mb-2 group-hover:text-primary transition-colors">{game.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-primary/20 rounded-md">
                                                    <Filter size={8} className="text-primary" />
                                                </div>
                                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.25em] italic opacity-80">{game.provider}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition duration-700 flex items-center justify-center backdrop-blur-sm pointer-events-none`}>
                                        <div className="px-8 py-3 bg-primary text-primary-foreground font-black transform translate-y-8 group-hover:translate-y-0 transition duration-700 uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/50 rounded-2xl">
                                            SECURE ACCESS
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={`p-20 text-center bg-card border border-border shadow-2xl ${uiDesign === 'vip' ? 'rounded-[3rem] border-primary/10' : 'rounded-3xl'
                            }`}>
                            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/10">
                                <Search className="text-primary/40" size={32} />
                            </div>
                            <p className="text-muted-foreground font-black uppercase text-xs tracking-[0.3em] italic opacity-40 mb-10">Query null. No asset protocols matching "{q}" synthesized.</p>
                            <Link href="/games" className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30">
                                VIEW ALL PROTOCOLS
                            </Link>
                        </div>
                    )}
                </section>

                {!q && (
                    <div className="text-center py-20">
                        <div className="w-16 h-1 w-32 bg-primary/20 mx-auto mb-10 rounded-full"></div>
                        <p className="text-muted-foreground font-black text-2xl uppercase tracking-[0.3em] mb-12 italic opacity-60">SYNCHRONIZE QUERY MATRIX</p>
                        <Link href="/" className={`px-12 py-5 bg-primary text-primary-foreground font-black hover:opacity-90 transition-all uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/40 ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-xl'
                            }`}>
                            RETURN TO BASE
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
