'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Search } from 'lucide-react';

export default function SeoSettingsPage() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPage, setSelectedPage] = useState<any | null>(null);

    // Fetch pages
    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const res = await fetch('/api/seo');
            const data = await res.json();
            if (res.ok) setPages(data.metadata || []);
        } catch (error) {
            console.error('Failed to fetch SEO data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPage) return;

        try {
            const res = await fetch('/api/seo', {
                method: 'POST', // Upsert
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedPage),
            });

            if (res.ok) {
                alert('SEO Settings Saved!');
                fetchMetadata();
            } else {
                alert('Error saving settings');
            }
        } catch (error) {
            alert('Failed to save');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this SEO configuration?')) return;
        try {
            const res = await fetch(`/api/seo?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchMetadata();
        } catch (error) {
            console.error('Delete failed');
        }
    };

    const createNew = () => {
        setSelectedPage({
            routePath: '',
            title: '',
            description: '',
            keywords: '',
            ogImage: ''
        });
    };

    return (
        <div className="h-[calc(100vh-130px)] flex flex-col md:flex-row gap-8">
            {/* Sidebar list of pages */}
            <div className="w-full md:w-[380px] bg-card border border-border rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
                    <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tighter italic">Route <span className="text-primary">Vault</span></h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">SEO Matrix</p>
                    </div>
                    <button onClick={createNew} className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1 space-y-2 no-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 space-y-4">
                            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Scanning Routes...</p>
                        </div>
                    ) : pages.map(page => (
                        <div
                            key={page._id}
                            onClick={() => setSelectedPage(page)}
                            className={`p-5 rounded-2xl cursor-pointer flex flex-col gap-1 transition-all border group ${selectedPage?._id === page._id
                                ? 'bg-background border-primary shadow-xl ring-1 ring-primary/10'
                                : 'bg-muted/10 border-transparent hover:bg-muted/30 text-muted-foreground hover:text-foreground'}`}
                        >
                            <span className="font-black text-xs uppercase tracking-widest truncate">{page.routePath || '/'}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-tight line-clamp-1 ${selectedPage?._id === page._id ? 'text-primary' : 'text-muted-foreground'}`}>
                                {page.title || 'Untitled Protocol'}
                            </span>
                        </div>
                    ))}
                    {pages.length === 0 && !loading && (
                        <div className="p-12 text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">No active routes found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 bg-card border border-border rounded-[2.5rem] shadow-2xl p-10 overflow-y-auto relative no-scrollbar">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>

                {selectedPage ? (
                    <form onSubmit={handleSave} className="space-y-10 relative z-10 max-w-3xl">
                        <div className="flex justify-between items-center pb-8 border-b border-border">
                            <div>
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter italic">Optimization <span className="text-primary italic">Protocol</span></h2>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Configure meta-data for indexability</p>
                            </div>
                            {selectedPage._id && (
                                <button type="button" onClick={() => handleDelete(selectedPage._id)} className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl transition-all">
                                    <Trash2 size={24} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Traffic Endpoint (Path)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Search size={16} />
                                </div>
                                <input
                                    type="text"
                                    value={selectedPage.routePath}
                                    onChange={e => setSelectedPage({ ...selectedPage, routePath: e.target.value })}
                                    className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-foreground font-black text-sm uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    placeholder="/"
                                    required
                                />
                            </div>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest ml-1 bg-muted/50 p-2 rounded-lg border border-border inline-block italic">
                                * Protocol must match exact system route
                            </p>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Meta Header (Title)</label>
                            <input
                                type="text"
                                value={selectedPage.title}
                                onChange={e => setSelectedPage({ ...selectedPage, title: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-2xl px-8 py-5 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-lg"
                                placeholder="Elite Gaming Hub - Homepage"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Meta Narrative (Description)</label>
                            <textarea
                                value={selectedPage.description}
                                onChange={e => setSelectedPage({ ...selectedPage, description: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-3xl px-8 py-6 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium h-32 resize-none leading-relaxed"
                                placeholder="A strategic summary for search engines..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Indexing Keywords</label>
                            <input
                                type="text"
                                value={selectedPage.keywords}
                                onChange={e => setSelectedPage({ ...selectedPage, keywords: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-2xl px-8 py-5 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                placeholder="choksapk, vaults, high-stakes"
                            />
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button type="submit" className="flex items-center gap-3 bg-primary hover:opacity-95 active:scale-95 text-primary-foreground font-black py-5 px-12 rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all uppercase tracking-[0.2em] text-xs">
                                <Save size={20} /> Deploy Protocol
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 relative z-10">
                        <div className="w-32 h-32 rounded-full bg-muted/20 flex items-center justify-center mb-8 border border-border">
                            <Search size={64} className="opacity-20 translate-x-1 translate-y-1" />
                        </div>
                        <p className="font-black uppercase tracking-[0.3em] text-[10px] text-center max-w-xs leading-loose">
                            Initialize route synchronization by selecting a path from the control panel
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

