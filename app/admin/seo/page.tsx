'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

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
                // Update existing
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
                // Create new
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

    return (
        <div className="min-h-screen bg-background p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter italic mb-3">
                        SEO Matrix
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base font-medium">
                        Manage metadata for all routes on your site
                    </p>
                </div>

                {/* Search & Add */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Search routes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-muted/30 border border-border rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsAdding(true);
                            resetForm();
                        }}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Add Route
                    </button>
                </div>

                {/* Add/Edit Form */}
                {(isAdding || editingId) && (
                    <div className="bg-card border border-border rounded-3xl p-8 mb-8 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
                                {editingId ? 'Edit Route' : 'New Route'}
                            </h2>
                            <button onClick={() => { setIsAdding(false); resetForm(); }} className="text-muted-foreground hover:text-foreground">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 ml-1">Route Path</label>
                                    <input
                                        type="text"
                                        placeholder="/about"
                                        value={formData.route}
                                        onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 ml-1">Page Title</label>
                                    <input
                                        type="text"
                                        placeholder="About Us | choksapk"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 ml-1">Meta Description</label>
                                <textarea
                                    placeholder="Describe this page in 150-160 characters..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 ml-1">Keywords (comma-separated)</label>
                                    <input
                                        type="text"
                                        placeholder="casino, games, slots"
                                        value={formData.keywords}
                                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 ml-1">OG Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={formData.ogImage}
                                        onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <label className="text-sm font-bold text-foreground">Active</label>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                {editingId ? 'Update Route' : 'Create Route'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Routes List */}
                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">Loading routes...</div>
                ) : filteredRoutes.length === 0 ? (
                    <div className="bg-card border border-border rounded-3xl p-12 text-center">
                        <p className="text-muted-foreground font-medium">No active routes found</p>
                        <p className="text-sm text-muted-foreground mt-2">Click "Add Route" to create your first SEO route</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredRoutes.map((route) => (
                            <div key={route._id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <code className="text-primary font-black text-sm bg-primary/10 px-3 py-1 rounded-lg">{route.route}</code>
                                            {!route.isActive && <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded uppercase font-black">Inactive</span>}
                                        </div>
                                        <h3 className="text-lg font-black text-foreground mb-2">{route.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{route.description}</p>
                                        {route.keywords && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                <span className="font-black">Keywords:</span> {route.keywords}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(route)}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} className="text-primary" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(route._id)}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} className="text-destructive" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
