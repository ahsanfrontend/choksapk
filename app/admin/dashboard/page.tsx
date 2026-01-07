'use client';

import { useState, useEffect } from 'react';
import { Activity, MousePointer2, Users, ArrowUpRight, Globe, RefreshCcw, Clock, AlertOctagon, Link as LinkIcon, ArrowRight, Plus, Trash2, ShieldAlert, X, Zap, Sparkles } from 'lucide-react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

interface AnalyticsData {
    totalVisits: number;
    totalClicks: number;
    total404s: number;
    redirects: any[];
    trajectory: any[];
    recentEvents: any[];
}

export default function AdminDashboard() {
    const settings = useSiteSettings();
    const uiDesign = settings?.uiDesign || 'vip';

    const [data, setData] = useState<AnalyticsData | null>(null);
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

    const cardRadius = uiDesign === 'vip' ? 'rounded-[2.5rem]' : uiDesign === 'modern' ? 'rounded-3xl' : 'rounded-xl';
    const buttonRadius = uiDesign === 'vip' ? 'rounded-2xl' : uiDesign === 'modern' ? 'rounded-xl' : 'rounded-md';

    if (loading && !data) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Syncing Command Center Dynamics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    {uiDesign === 'vip' && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                            <Sparkles size={12} /> Live Operations
                        </div>
                    )}
                    <h1 className={`font-black text-foreground uppercase tracking-tighter italic leading-none ${uiDesign === 'vip' ? 'text-4xl' : 'text-3xl'}`}>
                        Command <span className="text-primary italic">Center</span>
                    </h1>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic opacity-70">Enforcing real-time engagement and affiliate traffic protocols.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchStats}
                        disabled={isRefreshing}
                        className={`flex items-center gap-2 px-5 py-2.5 bg-muted/50 hover:bg-muted border border-border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${buttonRadius}`}
                    >
                        <RefreshCcw size={14} className={isRefreshing ? "animate-spin" : ""} />
                        Live Feed
                    </button>
                    <div className="relative group">
                        <select className={`bg-card border border-border text-foreground text-[10px] font-black uppercase tracking-widest px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all appearance-none cursor-pointer hover:bg-muted pr-10 ${buttonRadius}`}>
                            <option>Today</option>
                            <option>Last 7 Days</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users size={20} className="text-blue-500" />}
                    label="Active Nodes"
                    value={data?.totalVisits || 0}
                    trend="+24.2%"
                    color="blue"
                    uiDesign={uiDesign}
                />
                <StatCard
                    icon={<MousePointer2 size={20} className="text-emerald-500" />}
                    label="Partner Relay"
                    value={data?.totalClicks || 0}
                    trend="+18.4%"
                    color="emerald"
                    uiDesign={uiDesign}
                />
                <StatCard
                    icon={<AlertOctagon size={20} className="text-destructive" />}
                    label="Null Response"
                    value={data?.total404s || 0}
                    trend="Check Logs"
                    color="red"
                    uiDesign={uiDesign}
                />
                <StatCard
                    icon={<Globe size={20} className="text-purple-500" />}
                    label="Uptime Signal"
                    value="99.9%"
                    trend="Stable"
                    color="purple"
                    uiDesign={uiDesign}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Redirect Manager */}
                <div className={`lg:col-span-12 bg-card border border-border shadow-2xl overflow-hidden relative ${cardRadius}`}>
                    {uiDesign === 'vip' && (
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                    )}

                    <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tighter italic flex items-center gap-3">
                                <LinkIcon size={24} className="text-primary" /> Reroute Protocols
                            </h2>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 italic">Intercept and manipulate incoming network traffic paths</p>
                        </div>
                        <button
                            onClick={() => setIsAddingRedirect(true)}
                            className={`flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 ${buttonRadius}`}
                        >
                            <Plus size={16} /> ADD PROTOCOL
                        </button>
                    </div>

                    {isAddingRedirect && (
                        <div className="p-8 bg-muted/30 border-b border-border animate-in slide-in-from-top duration-300 relative z-10">
                            <form onSubmit={handleAddRedirect} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                <div className="space-y-2">
                                    <label className="block text-[8px] font-black text-muted-foreground uppercase tracking-widest ml-1">Source Interface</label>
                                    <input
                                        type="text"
                                        placeholder="/oldpath"
                                        className={`w-full bg-background border border-border px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary ${buttonRadius}`}
                                        value={newRedirect.sourcePath}
                                        onChange={(e) => setNewRedirect({ ...newRedirect, sourcePath: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[8px] font-black text-muted-foreground uppercase tracking-widest ml-1">Target Resolution</label>
                                    <input
                                        type="text"
                                        placeholder="/newpath"
                                        className={`w-full bg-background border border-border px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary ${buttonRadius}`}
                                        value={newRedirect.destinationPath}
                                        onChange={(e) => setNewRedirect({ ...newRedirect, destinationPath: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[8px] font-black text-muted-foreground uppercase tracking-widest ml-1">Logic Pattern</label>
                                    <select
                                        className={`w-full bg-background border border-border px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary h-[42px] appearance-none ${buttonRadius}`}
                                        value={newRedirect.type}
                                        onChange={(e) => setNewRedirect({ ...newRedirect, type: parseInt(e.target.value) })}
                                    >
                                        <option value={301}>301 Permanent</option>
                                        <option value={302}>302 Temporary</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className={`flex-1 bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] py-3 shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all ${buttonRadius}`}>Activate</button>
                                    <button type="button" onClick={() => setIsAddingRedirect(false)} className={`px-4 bg-muted border border-border text-muted-foreground hover:text-foreground transition-all ${buttonRadius}`}><X size={16} /></button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border">
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Source Protocol</th>
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Resolution</th>
                                    <th className="px-8 py-5 text-center text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Type</th>
                                    <th className="px-8 py-5 text-center text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Frequency</th>
                                    <th className="px-8 py-5 text-right text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {data?.redirects?.map((r: any) => (
                                    <tr key={r._id} className="hover:bg-muted/10 transition-colors group">
                                        <td className="px-8 py-5 text-[11px] font-black text-foreground uppercase tracking-tighter italic">{r.sourcePath}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3 text-primary">
                                                <Zap size={14} className="opacity-50" />
                                                <span className="text-[11px] font-black uppercase tracking-tighter italic">{r.destinationPath}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`text-[8px] font-black px-3 py-1 rounded-full border ${r.type === 301 ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                {r.type === 301 ? 'STABLE' : 'DYNAMIC'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-[11px] font-black text-muted-foreground tabular-nums">{r.clicks || 0}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => handleDeleteRedirect(r._id)} className="text-muted-foreground hover:text-destructive transition-all p-2 hover:bg-destructive/10 rounded-xl opacity-0 group-hover:opacity-100">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!data?.redirects || data.redirects.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-20">Matrix Clear: No Redirect Protocols</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Trajectory Plot */}
                <div className={`lg:col-span-8 bg-card border border-border shadow-2xl p-8 overflow-hidden relative group ${cardRadius}`}>
                    {uiDesign === 'vip' && (
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform group-hover:scale-110 duration-700"></div>
                    )}
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic mb-10 flex items-center gap-2">
                        <Activity size={18} className="text-primary" /> Traffic Trajectory
                    </h3>

                    <div className="h-64 flex items-end gap-3 md:gap-5 relative z-10 px-4">
                        {data?.trajectory?.map((day: any, i: number) => {
                            const maxVal = Math.max(...data.trajectory.map((d: any) => Math.max(d.visits, d.clicks)), 1);
                            const visitHeight = (day.visits / maxVal) * 100;
                            const clickHeight = (day.clicks / maxVal) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar h-full">
                                    <div className="w-full flex items-end justify-center gap-1.5 h-full min-h-[10px]">
                                        <div style={{ height: `${visitHeight}%` }} className="w-3 bg-blue-500/20 border-t-2 border-blue-500/50 rounded-t-sm hover:bg-blue-500 transition-all cursor-help relative group/tip">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-background border border-border text-[8px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity z-20 shadow-2xl pointer-events-none whitespace-nowrap">{day.visits} VISITS</div>
                                        </div>
                                        <div style={{ height: `${clickHeight}%` }} className="w-3 bg-emerald-500/20 border-t-2 border-emerald-500/50 rounded-t-sm hover:bg-emerald-500 transition-all cursor-help relative group/tip">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-background border border-border text-[8px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity z-20 shadow-2xl pointer-events-none whitespace-nowrap">{day.clicks} CLICKS</div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                                        {new Date(day._id).toLocaleDateString(undefined, { weekday: 'short' })}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Real-time Event Feed */}
                <div className={`lg:col-span-4 bg-card border border-border shadow-2xl overflow-hidden flex flex-col h-[500px] ${cardRadius}`}>
                    <div className="p-6 border-b border-border bg-muted/20">
                        <h2 className="text-xs font-black text-foreground uppercase tracking-[0.2em] italic flex items-center gap-2">
                            <RefreshCcw size={14} className="text-primary animate-spin" /> Live Protocol Log
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                        {data?.recentEvents?.map((event: any, i: number) => (
                            <div key={i} className={`p-4 rounded-2xl border transition-all flex items-start gap-4 hover:translate-x-1 duration-300 ${event.eventType === 'click' ? 'bg-emerald-500/5 border-emerald-500/10' : event.eventType === '404' ? 'bg-destructive/5 border-destructive/10' : 'bg-blue-500/5 border-blue-500/10'}`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${event.eventType === 'click' ? 'bg-emerald-500/10 text-emerald-500' : event.eventType === '404' ? 'bg-destructive/10 text-destructive' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {event.eventType === 'click' ? <Zap size={14} /> : event.eventType === '404' ? <ShieldAlert size={14} /> : <Activity size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${event.eventType === 'click' ? 'text-emerald-500' : event.eventType === '404' ? 'text-destructive' : 'text-blue-500'}`}>
                                            {event.eventType === 'click' ? 'RELAY SUCCESS' : event.eventType === '404' ? 'CLIENT ABORT' : 'NODE CONNECT'}
                                        </span>
                                        <span className="text-[8px] text-muted-foreground font-black opacity-40">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-foreground uppercase truncate tracking-tight italic">{event.path || '/'}</p>
                                    <p className="text-[7px] text-muted-foreground mt-1 truncate font-black uppercase tracking-widest opacity-30">{event.userAgent?.split(')')[0].slice(0, 30)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend, color, uiDesign }: any) {
    const colorClasses: any = {
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        red: 'bg-destructive/10 text-destructive border-destructive/20'
    };

    const cardRadius = uiDesign === 'vip' ? 'rounded-[2rem]' : uiDesign === 'modern' ? 'rounded-3xl' : 'rounded-xl';

    return (
        <div className={`bg-card border border-border p-8 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 ${cardRadius}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity duration-700 opacity-20 group-hover:opacity-40 ${color === 'blue' ? 'bg-blue-500' : color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : color === 'red' ? 'bg-destructive' : 'bg-purple-500'}`}></div>
            <div className="flex flex-col gap-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform duration-500 group-hover:scale-110 ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter italic tabular-nums">{value}</h3>
                        <span className={`text-[9px] font-black flex items-center gap-1 px-2 py-0.5 rounded-full border ${trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                            {trend.includes('+') && <ArrowUpRight size={10} />} {trend}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronDown(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
