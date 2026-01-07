import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import SiteSettings from '@/models/SiteSettings';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';
import { LayoutGrid, List, Sparkles, Filter } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/games', {
        title: 'All Gaming Assets | choksapk',
        description: 'Explore our complete repository of premium gaming assets and titles.'
    });
}

export const dynamic = 'force-dynamic';

export default async function AllGamesPage() {
    let games: any[] = [];
    let settings: any = null;

    try {
        await dbConnect();
        settings = await SiteSettings.findOne();
        games = await Game.find({ isActive: true }).sort({ createdAt: -1 });
    } catch (error) {
        console.error("Failed to fetch games:", error);
    }

    const uiDesign = settings?.uiDesign || 'vip';

    return (
        <div className={`min-h-screen py-16 md:py-24 transition-colors duration-500 ${uiDesign === 'vip' ? 'bg-[radial-gradient(circle_at_top_left,var(--primary-muted),transparent)]' : 'bg-background'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
                    <div className="space-y-4">
                        {uiDesign === 'vip' && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                                <Sparkles size={12} /> CENTRAL REPOSITORY
                            </div>
                        )}
                        <h1 className={`font-black text-foreground uppercase tracking-tighter italic leading-none ${uiDesign === 'vip' ? 'text-4xl md:text-7xl' :
                            uiDesign === 'modern' ? 'text-3xl md:text-6xl' :
                                'text-2xl md:text-5xl'
                            }`}>
                            The Master <span className="text-primary not-italic">{uiDesign === 'classic' ? 'Vault' : 'PROTOCOL'}</span>
                        </h1>
                        <div className={`h-1.5 bg-primary rounded-full transition-all duration-700 ${uiDesign === 'vip' ? 'w-48' : uiDesign === 'modern' ? 'w-32' : 'w-16'
                            }`}></div>
                        <p className={`text-muted-foreground max-w-2xl font-medium leading-relaxed ${uiDesign === 'vip' ? 'text-sm md:text-xl' : 'text-xs md:text-base'
                            }`}>
                            Access our complete collection of verified high-performance assets. Encrypted distribution for strategic gaming discovery.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className={`p-3 bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all ${uiDesign === 'vip' ? 'rounded-2xl' : uiDesign === 'modern' ? 'rounded-xl' : 'rounded-md'
                            }`}>
                            <Filter size={18} />
                        </button>
                        <div className={`flex items-center bg-muted/50 border border-border p-1 ${uiDesign === 'vip' ? 'rounded-2xl' : uiDesign === 'modern' ? 'rounded-xl' : 'rounded-md'
                            }`}>
                            <button className={`p-2 ${uiDesign === 'vip' ? 'bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20' : 'text-primary'}`}><LayoutGrid size={16} /></button>
                            <button className="p-2 text-muted-foreground hover:text-foreground"><List size={16} /></button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
                    {games.map((game, i) => (
                        <Link
                            href={`/game/${game.slug}`}
                            key={game._id.toString()}
                            className={`group block relative aspect-[3/4.2] overflow-hidden bg-card border transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 ${uiDesign === 'vip' ? 'rounded-[2.5rem] border-primary/10 shadow-xl hover:shadow-2xl hover:border-primary/40' :
                                uiDesign === 'modern' ? 'rounded-3xl border-border shadow-sm hover:border-primary' :
                                    'rounded-xl border-border hover:border-primary'
                                }`}
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="w-full h-full relative">
                                {game.thumbnail ? (
                                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted italic text-[10px] font-black uppercase">No Preview</div>
                                )}

                                {uiDesign === 'vip' && (
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="px-2 py-0.5 bg-background/20 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black text-white uppercase tracking-tighter">SECURE</div>
                                    </div>
                                )}

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 pt-20">
                                    <h3 className={`text-white font-black truncate uppercase tracking-tight leading-none mb-2 ${uiDesign === 'vip' ? 'text-sm md:text-base' : 'text-xs md:text-sm'
                                        }`}>{game.title}</h3>
                                    <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">{game.provider}</p>
                                </div>

                                <div className={`absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center backdrop-blur-[2px]`}>
                                    <span className={`px-8 py-3 bg-primary text-primary-foreground font-black transform translate-y-8 group-hover:translate-y-0 transition duration-500 uppercase text-xs shadow-xl shadow-primary/40 ${uiDesign === 'vip' ? 'rounded-2xl' : uiDesign === 'modern' ? 'rounded-xl' : 'rounded-md'
                                        }`}>Access Asset</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {(!games || games.length === 0) && (
                    <div className={`text-center py-32 mt-12 border-2 border-dashed border-border ${uiDesign === 'vip' ? 'bg-muted/30 rounded-[3rem]' : 'bg-muted/10 rounded-2xl'
                        }`}>
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-8 text-muted-foreground opacity-20">
                            <Filter size={40} />
                        </div>
                        <p className="text-muted-foreground font-black text-xl md:text-2xl uppercase tracking-[0.2em] mb-8 italic">Empty Chambers</p>
                        <Link href="/" className={`px-10 py-5 bg-primary text-primary-foreground font-black hover:opacity-90 transition-all uppercase tracking-widest text-xs shadow-xl shadow-primary/20 ${uiDesign === 'vip' ? 'rounded-2xl' : uiDesign === 'modern' ? 'rounded-xl' : 'rounded-md'
                            }`}>
                            Return to Base
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
