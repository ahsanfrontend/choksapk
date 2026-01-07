'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, CheckCircle, XCircle, Trash, Zap, Sparkles, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

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
    const settings = useSiteSettings();
    const uiDesign = settings?.uiDesign || 'vip';

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

    const cardRadius = uiDesign === 'vip' ? 'rounded-[2.5rem]' : uiDesign === 'modern' ? 'rounded-3xl' : 'rounded-xl';
    const rowRadius = uiDesign === 'vip' ? 'rounded-2xl' : uiDesign === 'modern' ? 'rounded-xl' : 'rounded-md';

    return (
        <div className="space-y-8">
            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className={`bg-primary/10 border border-primary/20 p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl shadow-primary/5 ${cardRadius}`}>
                    <div className="flex items-center gap-4 ml-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/20 px-6 py-2 rounded-full border border-primary/30">
                            {selectedIds.length} SELECTION LOCKED
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleBulkStatus(true)}
                            className={`px-5 py-3 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm ${rowRadius}`}
                            disabled={!!loading}
                        >
                            <CheckCircle size={14} /> ENFORCE ACTIVE
                        </button>
                        <button
                            onClick={() => handleBulkStatus(false)}
                            className={`px-5 py-3 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-amber-500/20 shadow-sm ${rowRadius}`}
                            disabled={!!loading}
                        >
                            <XCircle size={14} /> SUSPEND OPS
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className={`px-5 py-3 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-destructive/20 shadow-sm ${rowRadius}`}
                            disabled={!!loading}
                        >
                            <Trash size={14} /> PURGE DATA
                        </button>
                        <button
                            onClick={handleBulkSEO}
                            className={`px-5 py-3 bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 shadow-sm shadow-blue-500/20 animate-pulse-slow ${rowRadius}`}
                            disabled={!!loading}
                        >
                            <Sparkles size={14} /> MATRIX SEO
                        </button>
                    </div>
                </div>
            )}

            <div className={`bg-card border border-border shadow-2xl overflow-hidden relative ${cardRadius}`}>
                {loading === 'bulk' && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Syncing Operational State...</p>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${uiDesign === 'vip' ? 'bg-muted/30' : 'bg-muted/50'} border-b border-border transition-colors`}>
                                <th className="p-8 w-14">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded-lg border-2 border-border text-primary focus:ring-primary bg-muted/50 cursor-pointer transition-all"
                                        checked={selectedIds.length === games.length && games.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">Physical Asset</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">Classification</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">Node Provider</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic text-center">Protocol State</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic text-right">Operational Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {games.map((game) => (
                                <tr key={game._id} className={`hover:bg-muted/20 transition-all group duration-500 ${selectedIds.includes(game._id) ? 'bg-primary/5' : ''}`}>
                                    <td className="p-8">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-2 border-border text-primary focus:ring-primary bg-muted/50 cursor-pointer transition-all"
                                            checked={selectedIds.includes(game._id)}
                                            onChange={() => toggleSelect(game._id)}
                                        />
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 bg-muted overflow-hidden border border-border shadow-2xl transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 relative ${uiDesign === 'vip' ? 'rounded-[1.5rem]' : 'rounded-2xl'}`}>
                                                {game.thumbnail ? (
                                                    <img src={game.thumbnail} className="w-full h-full object-cover" alt={game.title} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-muted-foreground/40 bg-muted/50">NO IMG</div>
                                                )}
                                                {selectedIds.includes(game._id) && (
                                                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                                                        <Zap size={24} className="text-primary animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-base text-foreground uppercase tracking-tight italic group-hover:text-primary transition-colors">{game.title}</span>
                                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">ID: {game._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className="px-5 py-2 bg-muted/50 rounded-full text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground border border-border shadow-inner">{game.category}</span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <Filter size={12} className="text-primary/40" />
                                            <span className="text-[11px] font-black text-foreground uppercase tracking-wide italic">{game.provider}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-500 ${game.isActive
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                                : 'bg-red-500/10 text-red-500 border-red-500/30'
                                            }`}>
                                            {game.isActive ? 'OPERATIONAL' : 'DEACTIVATED'}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700">
                                            <Link
                                                href={`/game/${game.slug}`}
                                                target="_blank"
                                                className={`p-3.5 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all shadow-sm ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-xl'}`}
                                                title="View Resolution"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/games/${game._id}`}
                                                className={`p-3.5 hover:bg-amber-500/10 hover:text-amber-500 border border-transparent hover:border-amber-500/20 transition-all shadow-sm ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-xl'}`}
                                                title="Modify Config"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(game._id, game.title)}
                                                className={`p-3.5 hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all shadow-sm ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-xl'} ${loading === game._id ? 'animate-pulse' : ''}`}
                                                disabled={!!loading}
                                                title="Purge Entry"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {games.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-6 opacity-30">
                                            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center border border-border shadow-inner">
                                                <Trash2 size={48} className="text-muted-foreground" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-lg font-black uppercase tracking-[0.4em] italic text-muted-foreground">ZERO ASSETS SYNTHESIZED</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">The inventory matrix is currently clear of all game assets.</p>
                                            </div>
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
