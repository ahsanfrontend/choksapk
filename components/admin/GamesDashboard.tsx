'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, CheckCircle, XCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Game {
    _id: string;
    title: string;
    slug: string;
    category: string;
    provider: string;
    thumbnail: string;
    isActive: boolean;
}

export default function GamesDashboard({ initialGames }: { initialGames: Game[] }) {
    const [games, setGames] = useState<Game[]>(initialGames);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const toggleSelectAll = () => {
        if (selectedIds.length === games.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(games.map(g => g._id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        setLoading(id);
        try {
            const res = await fetch(`/api/games/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setGames(prev => prev.filter(g => g._id !== id));
                setSelectedIds(prev => prev.filter(i => i !== id));
            } else {
                alert('Failed to delete game');
            }
        } catch (error) {
            alert('Error deleting game');
        } finally {
            setLoading(null);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} games?`)) return;
        setLoading('bulk');
        try {
            const res = await fetch('/api/games/bulk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds })
            });
            if (res.ok) {
                setGames(prev => prev.filter(g => !selectedIds.includes(g._id)));
                setSelectedIds([]);
            } else {
                alert('Failed to delete games');
            }
        } catch (error) {
            alert('Error deleting games');
        } finally {
            setLoading(null);
        }
    };

    const handleBulkStatus = async (isActive: boolean) => {
        setLoading('bulk');
        try {
            const res = await fetch('/api/games/bulk', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds, update: { isActive } })
            });
            if (res.ok) {
                setGames(prev => prev.map(g =>
                    selectedIds.includes(g._id) ? { ...g, isActive } : g
                ));
                setSelectedIds([]);
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            alert('Error updating status');
        } finally {
            setLoading(null);
        }
    };

    const handleBulkSEO = async () => {
        if (!confirm(`Are you sure you want to generate SEO Matrix for ${selectedIds.length} games?\n\nThis will use your AI credits.`)) return;
        setLoading('bulk');
        try {
            const res = await fetch('/api/seo/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds })
            });

            const data = await res.json();

            if (res.ok) {
                const successCount = data.results.filter((r: any) => r.status === 'success').length;
                alert(`✅ Bulk SEO Complete!\n\nSuccessfully processed: ${successCount}/${selectedIds.length} games.\n\nCheck the SEO Matrix page to view the new routes.`);
                setSelectedIds([]);
            } else {
                alert(`Failed to start bulk processing: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error during bulk SEO processing');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-3xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-4 ml-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/20 px-4 py-1.5 rounded-full">
                            {selectedIds.length} SELECTED
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleBulkStatus(true)}
                            className="p-3 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"
                            disabled={!!loading}
                        >
                            <CheckCircle size={14} /> Activate
                        </button>
                        <button
                            onClick={() => handleBulkStatus(false)}
                            className="p-3 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-amber-500/20"
                            disabled={!!loading}
                        >
                            <XCircle size={14} /> Deactivate
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="p-3 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-destructive/20"
                            disabled={!!loading}
                        >
                            <Trash size={14} /> Delete
                        </button>
                        <button
                            onClick={handleBulkSEO}
                            className="p-3 bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-blue-500/20"
                            disabled={!!loading}
                        >
                            <span className="text-lg">✨</span> Matrix SEO
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-card rounded-[2rem] border border-border shadow-2xl overflow-hidden relative">
                {loading === 'bulk' && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="p-6 w-10">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded-lg border-2 border-border text-primary focus:ring-primary bg-muted/50 cursor-pointer transition-all"
                                        checked={selectedIds.length === games.length && games.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Title</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Provider</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {games.map((game) => (
                                <tr key={game._id} className={`hover:bg-muted/30 transition-colors group ${selectedIds.includes(game._id) ? 'bg-primary/5' : ''}`}>
                                    <td className="p-6">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-2 border-border text-primary focus:ring-primary bg-muted/50 cursor-pointer transition-all"
                                            checked={selectedIds.includes(game._id)}
                                            onChange={() => toggleSelect(game._id)}
                                        />
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden border border-border shadow-xl transform group-hover:scale-110 transition-transform">
                                                {game.thumbnail ? (
                                                    <img src={game.thumbnail} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-muted-foreground">NO IMG</div>
                                                )}
                                            </div>
                                            <span className="font-black text-sm text-foreground uppercase tracking-tight">{game.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border">{game.category}</span>
                                    </td>
                                    <td className="p-6 text-sm font-bold text-muted-foreground">{game.provider}</td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${game.isActive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                                            {game.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-3 text-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/game/${game.slug}`}
                                                target="_blank"
                                                className="p-3 hover:bg-primary/10 hover:text-primary rounded-xl transition-all shadow-sm order-1"
                                                title="View Public Page"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/games/${game._id}`}
                                                className="p-3 hover:bg-amber-500/10 hover:text-amber-600 rounded-xl transition-all shadow-sm order-2"
                                                title="Edit Details"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(game._id, game.title)}
                                                className={`p-3 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all shadow-sm order-3 ${loading === game._id ? 'animate-pulse' : ''}`}
                                                disabled={!!loading}
                                                title="Delete Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {games.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 border border-border">
                                                <Trash2 size={40} className="opacity-20" />
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-[0.2em]">Zero items detected in inventory</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
