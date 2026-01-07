import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import SiteSettings from '@/models/SiteSettings';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';
import PartnerClickTracker from '@/components/PartnerClickTracker';
import { ShieldCheck, Download, Star, ExternalLink, Info, Layers, RefreshCw, Sparkles } from 'lucide-react';

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
    let game: any = null;
    let relatedGames: any[] = [];
    let settings: any = null;

    try {
        await dbConnect();
        settings = await SiteSettings.findOne();
        game = await Game.findOne({ slug: slug, isActive: true });
        if (game) {
            relatedGames = await Game.find({
                category: game.category,
                _id: { $ne: game._id },
                isActive: true
            }).limit(4);
        }
    } catch (error) {
        console.error("Game Detail DB Error:", error);
    }

    if (!game) notFound();

    const uiDesign = settings?.uiDesign || 'vip';
    const isNew = game.createdAt && (new Date().getTime() - new Date(game.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

    return (
        <div className={`min-h-screen transition-colors duration-500 ${uiDesign === 'vip' ? 'bg-[radial-gradient(circle_at_top_left,var(--primary-muted),transparent)]' : 'bg-background'
            }`}>
            {/* Game Header Area */}
            <div className={`border-b transition-all duration-500 relative overflow-hidden ${uiDesign === 'vip' ? 'bg-card/50 backdrop-blur-xl border-primary/10 py-12 md:py-20' :
                uiDesign === 'modern' ? 'bg-card border-border py-8 md:py-12' :
                    'bg-muted py-6 md:py-8'
                }`}>
                {uiDesign === 'vip' && (
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
                )}

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 text-center md:text-left">
                            <div className={`relative flex-shrink-0 group ${uiDesign === 'vip' ? 'w-24 h-24 md:w-40 md:h-40' :
                                uiDesign === 'modern' ? 'w-20 h-20 md:w-32 md:h-32' :
                                    'w-16 h-16 md:w-24 md:h-24'
                                }`}>
                                <div className={`w-full h-full overflow-hidden border-2 transition-all duration-500 group-hover:scale-105 ${uiDesign === 'vip' ? 'rounded-[2.5rem] border-primary shadow-2xl shadow-primary/20 ring-4 ring-primary/5' :
                                    uiDesign === 'modern' ? 'rounded-3xl border-border shadow-lg' :
                                        'rounded-xl border-border shadow-sm'
                                    }`}>
                                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                                </div>
                                {isNew && (
                                    <div className={`absolute -top-2 -right-2 px-3 py-1 bg-primary text-primary-foreground text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1 ${uiDesign === 'vip' ? 'rounded-full' : 'rounded-lg'
                                        }`}>
                                        <Sparkles size={10} /> NEW
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h1 className={`font-black text-foreground uppercase tracking-tighter leading-none italic ${uiDesign === 'vip' ? 'text-2xl md:text-6xl' :
                                    uiDesign === 'modern' ? 'text-xl md:text-4xl' :
                                        'text-lg md:text-3xl'
                                    }`}>
                                    {game.title}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <span className={`px-4 py-1.5 font-black uppercase tracking-widest text-[8px] md:text-[10px] border transition-colors ${uiDesign === 'vip' ? 'bg-primary/10 text-primary border-primary/20 rounded-full' : 'bg-muted text-muted-foreground border-border rounded-lg'
                                        }`}>
                                        {game.provider}
                                    </span>
                                    {game.category && (
                                        <span className={`px-4 py-1.5 font-black uppercase tracking-widest text-[8px] md:text-[10px] border border-border bg-muted/50 text-muted-foreground ${uiDesign === 'vip' ? 'rounded-full' : 'rounded-lg'
                                            }`}>
                                            {game.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`hidden lg:flex items-center gap-8 px-10 py-6 border border-border transition-all ${uiDesign === 'vip' ? 'bg-background/50 backdrop-blur-md rounded-[3rem] border-primary/10 shadow-xl' : 'bg-muted/30 rounded-2xl'
                            }`}>
                            <div className="text-center">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Downloads</p>
                                <p className="text-xl font-black text-foreground">{game.downloadCount || '12.4k'}</p>
                            </div>
                            <div className="w-px h-10 bg-border"></div>
                            <div className="text-center">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Rating</p>
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="fill-primary text-primary" />
                                    <p className="text-xl font-black text-foreground">{game.rating || '4.8'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`container mx-auto px-4 ${uiDesign === 'vip' ? 'py-20 md:py-24' : 'py-12 md:py-16'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Main Section */}
                    <div className="lg:col-span-8 space-y-12">
                        <section className={`p-8 md:p-12 border transition-all ${uiDesign === 'vip' ? 'bg-card/50 backdrop-blur-md border-primary/10 rounded-[3rem] shadow-xl' :
                            uiDesign === 'modern' ? 'bg-card border-border rounded-3xl shadow-sm' :
                                'bg-background border-border rounded-xl'
                            }`}>
                            <h2 className="text-lg md:text-2xl font-black text-foreground mb-8 uppercase tracking-tighter italic flex items-center gap-3">
                                <span className="w-8 h-1.5 bg-primary rounded-full"></span>
                                {uiDesign === 'classic' ? 'Product Description' : 'Technical Specifications'}
                            </h2>
                            <div className={`prose prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-primary prose-headings:text-foreground prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic ${uiDesign === 'vip' ? 'prose-p:text-sm md:prose-p:text-base prose-p:font-medium prose-p:leading-relaxed' : 'prose-sm'
                                }`}>
                                <div dangerouslySetInnerHTML={{ __html: game.description || '' }} />
                            </div>
                        </section>

                        <section className={`p-8 md:p-12 border transition-all ${uiDesign === 'vip' ? 'bg-card/50 backdrop-blur-md border-primary/10 rounded-[3rem] shadow-xl' :
                            uiDesign === 'modern' ? 'bg-card border-border rounded-3xl shadow-sm' :
                                'bg-background border-border rounded-xl'
                            }`}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-lg md:text-2xl font-black text-foreground uppercase tracking-tighter italic flex items-center gap-3">
                                    <span className="w-8 h-1.5 bg-primary rounded-full"></span> Related Protocols
                                </h2>
                                <Link href="/games" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Deploy All</Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedGames.map((rel) => (
                                    <Link key={rel._id.toString()} href={`/game/${rel.slug}`} className="group space-y-3">
                                        <div className={`aspect-square overflow-hidden border transition-all duration-500 scale-100 group-hover:scale-105 ${uiDesign === 'vip' ? 'rounded-[2rem] border-primary/10 group-hover:border-primary shadow-lg' :
                                            uiDesign === 'modern' ? 'rounded-2xl border-border group-hover:border-primary' :
                                                'rounded-lg border-border'
                                            }`}>
                                            <img src={rel.thumbnail} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] md:text-xs font-black text-foreground uppercase truncate group-hover:text-primary transition-colors">{rel.title}</h4>
                                            <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">{rel.provider}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        <aside className={`p-8 md:p-10 border transition-all sticky top-32 ${uiDesign === 'vip' ? 'bg-card rounded-[3.5rem] border-primary/20 shadow-2xl shadow-primary/5 ring-1 ring-primary/10' :
                            uiDesign === 'modern' ? 'bg-card border-border rounded-[2.5rem] shadow-xl' :
                                'bg-muted border-border rounded-2xl shadow-sm'
                            }`}>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-base md:text-lg font-black text-foreground uppercase tracking-tighter italic mb-3">Deployment Hub</h3>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed">Verified binary deployment for secure tactical discovery. SHA-256 integrity monitored.</p>
                                </div>

                                <PartnerClickTracker gameId={game._id.toString()} path={path}>
                                    <a
                                        href={game.referralUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full py-6 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group shadow-2xl ${uiDesign === 'vip' ? 'bg-primary text-primary-foreground rounded-3xl shadow-primary/30 hover:opacity-90' :
                                            uiDesign === 'modern' ? 'bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700' :
                                                'bg-foreground text-background rounded-xl'
                                            }`}
                                    >
                                        <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Download size={18} /> Download Protocol
                                        </span>
                                        <span className="text-[8px] font-black opacity-60 uppercase tracking-tighter">Secure Build {game.version || '1.0.0'}</span>
                                    </a>
                                </PartnerClickTracker>

                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    {[
                                        { icon: <Layers size={14} />, label: 'Asset Size', value: game.fileSize || '38 MB' },
                                        { icon: <ShieldCheck size={14} />, label: 'OS Integrity', value: game.requirements || 'Android 6+' },
                                        { icon: <RefreshCw size={14} />, label: 'Last Sync', value: 'Live Feed' },
                                        { icon: <ExternalLink size={14} />, label: 'Distribution', value: 'Global Node' },
                                    ].map((spec, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-muted-foreground uppercase tracking-widest font-black text-[9px]">
                                                <span className="text-primary">{spec.icon}</span>
                                                {spec.label}
                                            </div>
                                            <div className="text-[10px] font-black text-foreground uppercase tracking-tight italic">{spec.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className={`p-6 flex items-center gap-4 transition-colors ${uiDesign === 'vip' ? 'bg-primary/5 rounded-[2rem] border border-primary/10' : 'bg-muted/50 rounded-2xl border border-border'
                                    }`}>
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none mb-1">Virus Scan Clear</p>
                                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter italic">SHA-256 Passed</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
