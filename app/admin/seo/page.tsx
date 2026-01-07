'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, Sparkles, ShieldCheck, Zap, Layers } from 'lucide-react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

interface SEORoute {
    _id: string;
    route: string;
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    isActive: boolean;
}

export default function SEOMatrixPage() {
    const settings = useSiteSettings();
    const uiDesign = settings?.uiDesign || 'vip';

    const [routes, setRoutes] = useState<SEORoute[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        route: '',
        title: '',
        description: '',
        keywords: '',
        ogImage: '',
        isActive: true,
    });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const res = await fetch('/api/seo/routes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setRoutes(data);
            } else {
                console.error('Failed to fetch routes, status:', res.status);
            }
        } catch (error) {
            console.error('Failed to fetch routes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');

        try {
            if (editingId) {
                const res = await fetch(`/api/seo/routes/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    await fetchRoutes();
                    resetForm();
                }
            } else {
                const res = await fetch('/api/seo/routes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    await fetchRoutes();
                    resetForm();
                    setIsAdding(false);
                }
            }
        } catch (error) {
            console.error('Failed to save route:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this SEO route?')) return;

        const token = localStorage.getItem('adminToken');
        const res = await fetch(`/api/seo/routes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            await fetchRoutes();
        }
    };

    const startEdit = (route: SEORoute) => {
        setFormData({
            route: route.route,
            title: route.title,
            description: route.description,
            keywords: route.keywords || '',
            ogImage: route.ogImage || '',
            isActive: route.isActive,
        });
        setEditingId(route._id);
        setIsAdding(true);
    };

    const resetForm = () => {
        setFormData({
            route: '',
            title: '',
            description: '',
            keywords: '',
            ogImage: '',
            isActive: true,
        });
        setEditingId(null);
    };

    const filteredRoutes = routes.filter(r =>
        r.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const cardRadius = uiDesign === 'vip' ? 'rounded-[2.5rem]' : uiDesign === 'modern' ? 'rounded-[1.5rem]' : 'rounded-xl';
    const inputRadius = uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-xl';

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h1 className={`font-black text-foreground uppercase tracking-tighter italic ${uiDesign === 'vip' ? 'text-5xl md:text-6xl' : 'text-3xl md:text-5xl'
                            }`}>
                            SEO <span className="text-primary not-italic">Matrix</span>
                        </h1>
                        {uiDesign === 'vip' && <Sparkles className="text-primary animate-pulse" size={32} />}
                    </div>
                    <p className="text-muted-foreground text-sm font-black uppercase tracking-[0.2em] opacity-60">
                        {uiDesign === 'vip' ? 'Synthesize metadata protocols for edge node resolution' : 'Manage metadata for all routes on your site'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        resetForm();
                    }}
                    className={`px-10 py-4 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-black text-xs uppercase tracking-[0.25em] flex items-center gap-3 shadow-2xl shadow-primary/30 transition-all ${inputRadius}`}
                >
                    <Plus size={18} /> Add New Matrix Node
                </button>
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors duration-500" size={20} />
                <input
                    type="text"
                    placeholder="Query protocol routes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-16 pr-6 py-5 bg-card/50 backdrop-blur-xl border border-border group-focus-within:border-primary/50 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all duration-500 font-bold ${inputRadius}`}
                />
            </div>

            {/* Add/Edit Form Overlay/Section */}
            {(isAdding || editingId) && (
                <div className={`bg-card/80 backdrop-blur-2xl border border-primary/20 p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-500 ${cardRadius}`}>
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                                {editingId ? <Edit2 size={24} /> : <Plus size={24} />}
                            </div>
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight italic">
                                {editingId ? 'Modify Matrix Node' : 'Synthesize New Node'}
                            </h2>
                        </div>
                        <button onClick={() => { setIsAdding(false); resetForm(); }} className="p-3 hover:bg-muted border border-transparent hover:border-border rounded-2xl transition-all text-muted-foreground hover:text-foreground">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
                                    <Zap size={12} /> ROUTE PATH
                                </label>
                                <input
                                    type="text"
                                    placeholder="/discovery"
                                    value={formData.route}
                                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                                    className={`w-full bg-muted/30 border border-border px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold ${inputRadius}`}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
                                    <Layers size={12} /> NODE TITLE
                                </label>
                                <input
                                    type="text"
                                    placeholder="Prime Resolution | SiteName"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={`w-full bg-muted/30 border border-border px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold ${inputRadius}`}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
                                <ShieldCheck size={12} /> METADATA DESCRIPTION
                            </label>
                            <textarea
                                placeholder="Formalize the resolution description in 160 characters..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className={`w-full bg-muted/30 border border-border px-6 py-5 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none font-bold ${inputRadius}`}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">ENCRYPTION TAGS (KEYWORDS)</label>
                                <input
                                    type="text"
                                    placeholder="protocol, matrix, secure"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                    className={`w-full bg-muted/30 border border-border px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold ${inputRadius}`}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">VISUAL ASSET (OG IMAGE)</label>
                                <input
                                    type="text"
                                    placeholder="https://assets.site.com/og.jpg"
                                    value={formData.ogImage}
                                    onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                                    className={`w-full bg-muted/30 border border-border px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold ${inputRadius}`}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl w-fit">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-6 h-6 rounded-lg border-primary/50 text-primary bg-transparent focus:ring-primary"
                            />
                            <label className="text-xs font-black text-primary uppercase tracking-[0.2em] italic">Protocol Active</label>
                        </div>
                        <button
                            type="submit"
                            className={`w-full bg-primary hover:opacity-90 text-primary-foreground font-black py-5 uppercase tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/40 ${inputRadius}`}
                        >
                            <Save size={20} />
                            {editingId ? 'COMMIT PROTOCOL UPDATES' : 'INITIALIZE NODE SEQUENCE'}
                        </button>
                    </form>
                </div>
            )}

            {/* Routes List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">Scanning Matrix Nodes...</p>
                </div>
            ) : filteredRoutes.length === 0 ? (
                <div className={`bg-card/50 border border-dashed border-border p-20 text-center ${cardRadius}`}>
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
                        <Layers className="text-muted-foreground/30" size={32} />
                    </div>
                    <p className="text-muted-foreground font-black uppercase tracking-[0.3em] italic opacity-40">Zero Node Sequences Detected</p>
                    <p className="text-[10px] font-bold text-muted-foreground/60 mt-4 uppercase tracking-widest">Protocol initialization required for SEO resolution.</p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {filteredRoutes.map((route) => (
                        <div key={route._id} className={`bg-card border border-border p-8 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden ${cardRadius}`}>
                            {uiDesign === 'vip' && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-bl-full"></div>
                            )}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                                            <code className="text-primary font-black text-xs tracking-wider">{route.route}</code>
                                        </div>
                                        {!route.isActive && (
                                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg">Suspended</span>
                                        )}
                                        {uiDesign === 'vip' && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                                <ShieldCheck size={10} /> Verified Protocol
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic group-hover:text-primary transition-colors">{route.title}</h3>
                                        <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-3xl">{route.description}</p>
                                    </div>
                                    {route.keywords && (
                                        <div className="flex items-center gap-3 pt-2">
                                            <Zap size={10} className="text-primary" />
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60">
                                                {route.keywords}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex md:flex-col gap-3">
                                    <button
                                        onClick={() => startEdit(route)}
                                        className={`p-4 bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary/20 transition-all text-primary group-hover:shadow-lg ${inputRadius}`}
                                        title="Modify Configuration"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(route._id)}
                                        className={`p-4 bg-muted/50 hover:bg-destructive/10 border border-border hover:border-destructive/20 transition-all text-destructive group-hover:shadow-lg ${inputRadius}`}
                                        title="Purge Node"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
