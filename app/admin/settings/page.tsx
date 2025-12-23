'use client';
import { useState, useEffect } from 'react';
import { Save, UserPlus, Trash2, Globe, Shield, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({
        siteName: '',
        logoUrl: '',
        faviconUrl: '',
        socialLinks: { facebook: '', twitter: '', instagram: '' },
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (!data.error) setSettings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                body: JSON.stringify(settings),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                alert('Settings saved successfully!');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse font-black uppercase tracking-[0.2em] py-32">Synchronizing...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter italic">System <span className="text-primary italic">Matrix</span></h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Configure global parameters and security protocols.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-3 px-10 py-4 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-black text-xs uppercase tracking-widest rounded-[1.25rem] transition-all disabled:opacity-50 shadow-2xl shadow-primary/20"
                >
                    {saving ? 'Processing...' : <><Save size={18} /> Deploy Changes</>}
                </button>
            </div>

            <div className="flex gap-2 p-1.5 bg-muted rounded-[2rem] w-fit border border-border overflow-x-auto no-scrollbar">
                {[
                    { id: 'general', label: 'Core', icon: <Globe size={16} /> },
                    { id: 'social', label: 'Social', icon: <LinkIcon size={16} /> },
                    { id: 'users', label: 'Access', icon: <Shield size={16} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-8 py-3 text-[10px] font-black tracking-widest transition-all rounded-[1.5rem] whitespace-nowrap uppercase ${activeTab === tab.id
                            ? 'bg-background text-primary shadow-xl ring-1 ring-border'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                {activeTab === 'general' && (
                    <div className="space-y-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Platform Identity</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                    placeholder="Enter Site Name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <ImageIcon size={14} /> Brand Mark (URL)
                                </label>
                                <input
                                    type="text"
                                    value={settings.logoUrl}
                                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
                                    placeholder="https://example.com/logo.png"
                                />
                                {settings.logoUrl && (
                                    <div className="mt-4 p-4 bg-muted/50 rounded-2xl inline-block border border-border group overflow-hidden">
                                        <img src={settings.logoUrl} alt="Logo Preview" className="h-10 object-contain transition-transform group-hover:scale-110" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Favicon Architecture</label>
                                <input
                                    type="text"
                                    value={settings.faviconUrl}
                                    onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
                                    placeholder="https://example.com/favicon.ico"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {['facebook', 'twitter', 'instagram'].map(platform => (
                            <div key={platform} className="space-y-3">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 capitalize">{platform} Handle</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <LinkIcon size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        value={settings.socialLinks?.[platform] || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialLinks: { ...settings.socialLinks, [platform]: e.target.value }
                                        })}
                                        className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold"
                                        placeholder={`https://${platform}.com/vault`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'users' && <UserManagementSection />}
            </div>
        </div>
    );
}

function UserManagementSection() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (Array.isArray(data)) setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 relative z-10">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Personnel Registry</h3>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-foreground text-background text-[10px] font-black rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest shadow-xl shadow-foreground/10">
                    <UserPlus size={14} /> Recruit Personnel
                </button>
            </div>

            <div className="border border-border rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                        <tr>
                            <th className="px-6 py-4">Identity</th>
                            <th className="px-6 py-4">Clearance</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Sanction</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map(user => (
                            <tr key={user._id} className="text-sm hover:bg-muted/30 transition-colors group">
                                <td className="px-6 py-6">
                                    <div className="font-black text-foreground uppercase tracking-tight text-sm mb-1">{user.name}</div>
                                    <div className="text-[10px] font-medium text-muted-foreground">{user.email}</div>
                                </td>
                                <td className="px-6 py-6 font-bold">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-600'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-6">
                                    <span className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> AUTHORIZED
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-right">
                                    <button className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-black uppercase tracking-[0.2em] italic">No active personnel found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold uppercase tracking-widest bg-muted/50 p-4 rounded-xl border border-border">
                <Shield size={12} className="text-primary" />
                Personnel actions are subject to high-level surveillance. All modifications are logged in the secure audit trail.
            </div>
        </div>
    );
}

