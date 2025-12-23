'use client';

import { useState, useEffect } from 'react';
import { Activity, MousePointer2, Users, ArrowUpRight, Globe, RefreshCcw, Clock, AlertOctagon, Link as LinkIcon, ArrowRight, Plus, Trash2, ShieldAlert, X } from 'lucide-react';

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Redirect Form State
    const [isAddingRedirect, setIsAddingRedirect] = useState(false);
    const [newRedirect, setNewRedirect] = useState({
        sourcePath: '',
        destinationPath: '',
        type: 301
    });

    const fetchStats = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('/api/analytics/stats');
            const result = await res.json();
            if (res.ok) setData(result);
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleAddRedirect = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/redirects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRedirect)
            });
            if (res.ok) {
                setNewRedirect({ sourcePath: '', destinationPath: '', type: 301 });
                setIsAddingRedirect(false);
                fetchStats();
            }
        } catch (err) {
            console.error('Failed to add redirect');
        }
    };

    const handleDeleteRedirect = async (id: string) => {
        if (!confirm('Abort this redirect protocol?')) return;
        try {
            await fetch('/api/redirects', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            fetchStats();
        } catch (err) {
            console.error('Failed to delete');
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Syncing Command Center Dynamics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Command <span className="text-primary italic">Center</span></h1>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 italic">Real-time engagement and affiliate traffic metrics.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchStats}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCcw size={14} className={isRefreshing ? "animate-spin" : ""} />
                        Live Feed
                    </button>
                    <select className="bg-card border border-border text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all appearance-none cursor-pointer hover:bg-muted">
                        <option>Today</option>
                        <option>Last 7 Days</option>
                    </select>
                </div>
            </div>

            {/* Redirect Manager - PROMOTED TO TOP */}
            <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>

                <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tighter italic flex items-center gap-3">
                            <LinkIcon size={24} className="text-primary" /> Redirect Protocol
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Intercept and reroute broken or legacy network paths</p>
                    </div>
                    <button
                        onClick={() => setIsAddingRedirect(true)}
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                    >
                        <Plus size={16} /> Deploy New Redirect
                    </button>
                </div>

                {isAddingRedirect && (
                    <div className="p-8 bg-muted/30 border-b border-border animate-in slide-in-from-top duration-300">
                        <form onSubmit={handleAddRedirect} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="block text-[8px] font-black text-muted-foreground uppercase tracking-widest ml-1">Source Path (From)</label>
                                <input
                                    type="text"
                                    placeholder="/old-path"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={newRedirect.sourcePath}
                                    onChange={(e) => setNewRedirect({ ...newRedirect, sourcePath: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[8px] font-black text-muted-foreground uppercase tracking-widest ml-1">Destination (To)</label>
                                <input
                                    type="text"
                                    placeholder="/new-path"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={newRedirect.destinationPath}
                                    onChange={(e) => setNewRedirect({ ...newRedirect, destinationPath: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[8px] font-black text-muted-foreground uppercase tracking-widest ml-1">Type</label>
                                <select
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary h-[42px] appearance-none"
                                    value={newRedirect.type}
                                    onChange={(e) => setNewRedirect({ ...newRedirect, type: parseInt(e.target.value) })}
                                >
                                    <option value={301}>301 Permanent</option>
                                    <option value={302}>302 Temporary</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">Enable</button>
                                <button type="button" onClick={() => setIsAddingRedirect(false)} className="px-4 bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all"><X size={16} /></button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="px-8 py-4 text-left text-[9px] font-black text-muted-foreground uppercase tracking-widest">Source Protocol</th>
                                <th className="px-8 py-4 text-left text-[9px] font-black text-muted-foreground uppercase tracking-widest">Target Resolution</th>
                                <th className="px-8 py-4 text-center text-[9px] font-black text-muted-foreground uppercase tracking-widest">Type</th>
                                <th className="px-8 py-4 text-center text-[9px] font-black text-muted-foreground uppercase tracking-widest">Hits</th>
                                <th className="px-8 py-4 text-right text-[9px] font-black text-muted-foreground uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {data?.redirects?.map((r: any) => (
                                <tr key={r._id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-8 py-5 text-[11px] font-black text-foreground uppercase tracking-tighter truncate max-w-[200px]">{r.sourcePath}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-primary">
                                            <ArrowRight size={14} />
                                            <span className="text-[11px] font-black uppercase tracking-tighter truncate max-w-[200px]">{r.destinationPath}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${r.type === 301 ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                            {r.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center text-[11px] font-black text-muted-foreground">{r.clicks || 0}</td>
                                    <td className="px-8 py-5 text-right">
                                        <button onClick={() => handleDeleteRedirect(r._id)} className="text-muted-foreground hover:text-destructive transition-all p-2 hover:bg-destructive/10 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!data?.redirects || data.redirects.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-50">No active redirection protocols deployed</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users size={20} className="text-blue-500" />}
                    label="Site Traffic"
                    value={data?.totalVisits || 0}
                    trend="+24.2%"
                    color="blue"
                />
                <StatCard
                    icon={<MousePointer2 size={20} className="text-emerald-500" />}
                    label="Partner Clicks"
                    value={data?.totalClicks || 0}
                    trend="+18.4%"
                    color="emerald"
                />
                <StatCard
                    icon={<AlertOctagon size={20} className="text-destructive" />}
                    label="Broken (404)"
                    value={data?.total404s || 0}
                    trend="Check Logs"
                    color="red"
                />
                <StatCard
                    icon={<Globe size={20} className="text-purple-500" />}
                    label="Uptime Signal"
                    value="99.9%"
                    trend="Stable"
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Traffic Chart */}
                <div className="lg:col-span-8 bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-lg font-black text-foreground uppercase tracking-tight italic flex items-center gap-2">
                            Traffic Trajectory
                        </h2>
                    </div>

                    <div className="h-64 flex items-end gap-2 md:gap-4 relative z-10">
                        {data?.trajectory?.map((day: any, i: number) => {
                            const maxVal = Math.max(...data.trajectory.map((d: any) => Math.max(d.visits, d.clicks)), 1);
                            const visitHeight = (day.visits / maxVal) * 100;
                            const clickHeight = (day.clicks / maxVal) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                    <div className="w-full flex items-end gap-1 h-full min-h-[20px]">
                                        <div style={{ height: `${visitHeight}%` }} className="w-1/2 bg-blue-500/30 border-t-2 border-blue-500 rounded-t-sm hover:bg-blue-500/50 transition-all cursor-crosshair relative">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-background border border-border text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity z-20 shadow-xl">{day.visits}</div>
                                        </div>
                                        <div style={{ height: `${clickHeight}%` }} className="w-1/2 bg-emerald-500/30 border-t-2 border-emerald-500 rounded-t-sm hover:bg-emerald-500/50 transition-all cursor-crosshair relative">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-background border border-border text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity z-20 shadow-xl">{day.clicks}</div>
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter truncate w-full text-center">
                                        {new Date(day._id).toLocaleDateString(undefined, { weekday: 'short' })}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Instant Feed */}
                <div className="lg:col-span-4 bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[480px]">
                    <div className="p-6 border-b border-border bg-muted/30">
                        <h2 className="text-sm font-black text-foreground uppercase tracking-widest italic flex items-center gap-2">
                            <Clock size={16} className="text-primary animate-pulse" /> Instant Feed
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                        {data?.recentEvents?.map((event: any, i: number) => (
                            <div key={i} className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${event.eventType === 'click' ? 'bg-emerald-500/5 border-emerald-500/20' : event.eventType === '404' ? 'bg-destructive/5 border-destructive/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.eventType === 'click' ? 'bg-emerald-500/10 text-emerald-500 shadow-sm' : event.eventType === '404' ? 'bg-destructive/10 text-destructive' : 'bg-blue-500/10 text-blue-500 shadow-sm'}`}>
                                    {event.eventType === 'click' ? <MousePointer2 size={14} /> : event.eventType === '404' ? <ShieldAlert size={14} /> : <Users size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${event.eventType === 'click' ? 'text-emerald-500' : event.eventType === '404' ? 'text-destructive' : 'text-blue-500'}`}>
                                            {event.eventType === 'click' ? 'Partner Click' : event.eventType === '404' ? 'Broken Link' : 'Site Visit'}
                                        </span>
                                        <span className="text-[8px] text-muted-foreground font-bold">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-foreground uppercase truncate tracking-tight">{event.path || '/'}</p>
                                    <p className="text-[8px] text-muted-foreground mt-1 truncate font-medium uppercase tracking-tighter opacity-60 italic">{event.userAgent?.split(')')[0].slice(0, 30)}...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend, color }: any) {
    const colorClasses: any = {
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        red: 'bg-destructive/10 text-destructive border-destructive/20'
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 transition-colors ${color === 'blue' ? 'bg-blue-500/5 group-hover:bg-blue-500/10' : color === 'emerald' ? 'bg-emerald-500/5 group-hover:bg-emerald-500/10' : color === 'amber' ? 'bg-amber-500/5 group-hover:bg-amber-500/10' : color === 'red' ? 'bg-destructive/5 group-hover:bg-destructive/10' : 'bg-purple-500/5 group-hover:bg-purple-500/10'}`}></div>
            <div className="flex flex-col gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">{value}</h3>
                        <span className={`text-[9px] font-black flex items-center gap-0.5 ${trend.includes('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
                            {trend.includes('+') ? <ArrowUpRight size={10} /> : null}
                            {trend}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
