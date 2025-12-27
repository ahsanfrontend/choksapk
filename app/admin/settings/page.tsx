'use client';
import { useState, useEffect } from 'react';
import { Save, UserPlus, Trash2, Globe, Shield, Image as ImageIcon, Link as LinkIcon, Activity, Lock, Key, X, Check } from 'lucide-react';

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
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        fetchSettings();
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.user) setCurrentUser(data.user);
        } catch (err) {
            console.error(err);
        }
    };

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
                    { id: 'ai', label: 'Intelligence', icon: <Activity size={16} /> },
                    { id: 'security', label: 'Security', icon: <Lock size={16} /> },
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

                {activeTab === 'ai' && (
                    <div className="space-y-10 relative z-10">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <Activity size={14} className="text-primary" /> OpenAI Repository Key
                            </label>
                            <input
                                type="password"
                                value={settings.openaiKey || ''}
                                onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono text-sm"
                                placeholder="sk-proj-..."
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <Activity size={14} className="text-emerald-500" /> Google Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={settings.geminiKey || ''}
                                onChange={(e) => setSettings({ ...settings, geminiKey: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono text-sm"
                                placeholder="AIzaSy..."
                            />
                            <p className="text-[9px] text-muted-foreground font-medium ml-2 uppercase tracking-widest leading-relaxed">
                                This key powers the autonomous humanization and SEO rearrangement protocols using Google's Gemini AI.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-10 relative z-10 w-full max-w-2xl">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-border">
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Admin Credentials</h3>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Update your personal access key.</p>
                                </div>
                            </div>

                            {currentUser ? (
                                <ChangePasswordForm userId={currentUser._id} />
                            ) : (
                                <div className="text-sm text-red-500 font-bold">Unable to identify current user.</div>
                            )}
                        </div>
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
    const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');

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

    const handlePasswordUpdate = async (userId: string) => {
        if (!newPassword || newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({ password: newPassword }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                alert('Password updated successfully');
                setEditingPasswordId(null);
                setNewPassword('');
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to update');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating password');
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
                                    <div className="flex justify-end gap-2">
                                        {editingPasswordId === user._id ? (
                                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <input
                                                    type="text"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    placeholder="New Pass..."
                                                    className="w-32 bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary"
                                                />
                                                <button onClick={() => handlePasswordUpdate(user._id)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => { setEditingPasswordId(null); setNewPassword(''); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setEditingPasswordId(user._id); setNewPassword(''); }}
                                                className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                title="Reset Password"
                                            >
                                                <Key size={18} />
                                            </button>
                                        )}
                                        <button className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
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

function ChangePasswordForm({ userId }: { userId: string }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!password || password !== confirm) {
            alert("Passwords don't match or are empty");
            return;
        }
        if (password.length < 6) {
            alert("Password too short");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({ password }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                alert('Password updated successfully');
                setPassword('');
                setConfirm('');
            } else {
                alert('Failed to update password');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">New Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                    placeholder="••••••••"
                />
            </div>
            <div className="space-y-3">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                    placeholder="••••••••"
                />
            </div>
            <div className="md:col-span-2 pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 px-8 py-3 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                    {loading ? 'Updating...' : <><Save size={14} /> Update Credentials</>}
                </button>
            </div>
        </div>
    );
}

