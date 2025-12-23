'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Shield, User as UserIcon, ShieldCheck, Mail, Lock, UserCog, Trash2, Search, X } from 'lucide-react';

export default function UsersManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [me, setMe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMeAndUsers();
    }, []);

    const fetchMeAndUsers = async () => {
        try {
            const [meRes, usersRes] = await Promise.all([
                fetch('/api/auth/me'),
                fetch('/api/users')
            ]);

            const meData = await meRes.json();
            const usersData = await usersRes.json();

            if (meRes.ok) setMe(meData.user);
            if (usersRes.ok) setUsers(usersData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setShowAddModal(false);
                setFormData({ name: '', email: '', password: '', role: 'user', status: 'active' });
                fetchMeAndUsers();
            } else {
                setError(data.error || 'Failed to create user');
            }
        } catch (err) {
            setError('System error. Check connection context.');
        }
    };

    const handleDeleteUser = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to terminate access for "${name}"?`)) return;

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok) {
                fetchMeAndUsers();
            } else {
                alert(data.error || 'Deletion failed');
            }
        } catch (err) {
            alert('Transmission error during deletion.');
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Syncing User Directory...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter italic">User <span className="text-primary italic">Control Protocol</span></h1>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 italic">Hierarchical account management and credential deployment</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-3 bg-primary hover:opacity-95 active:scale-95 text-primary-foreground font-black py-4 px-8 rounded-2xl shadow-2xl shadow-primary/20 transition-all uppercase tracking-widest text-xs"
                >
                    <UserPlus size={18} /> Initialize New User
                </button>
            </div>

            {/* User Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user._id} className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-colors group-hover:bg-primary/10"></div>

                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className={`p-4 rounded-2xl border ${user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : user.role === 'admin' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                {user.role === 'super_admin' ? <ShieldCheck size={24} /> : user.role === 'admin' ? <Shield size={24} /> : <UserIcon size={24} />}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                                    {user.status}
                                </span>
                                <span className="text-[7px] text-muted-foreground font-black uppercase tracking-tighter mt-1 italic">Node {user._id.slice(-6)}</span>
                            </div>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight truncate italic">{user.name}</h3>
                            <p className="text-xs text-muted-foreground font-medium truncate">{user.email}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border flex justify-between items-center relative z-10">
                            <div>
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Access Tier</p>
                                <span className="text-[10px] font-black text-foreground uppercase tracking-tighter italic">{user.role.replace('_', ' ')}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-xl bg-muted/30 border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                                    <UserCog size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                    className="w-10 h-10 rounded-xl bg-muted/30 border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-lg rounded-[3rem] border border-border shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="p-10 relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter italic">Initialize <span className="text-primary italic">Identity</span></h2>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Deploying new credentials to the master node</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-[10px] font-black text-destructive uppercase tracking-widest">
                                    Error: {error}
                                </div>
                            )}

                            <form onSubmit={handleCreateUser} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Identity Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <UserIcon size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full bg-muted/30 border border-border rounded-2xl pl-14 pr-6 py-4 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                            placeholder="Operator Prime"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Communication Endpoint (Email)</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full bg-muted/30 border border-border rounded-2xl pl-14 pr-6 py-4 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                            placeholder="operator@vault.network"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Access Protocol (Password)</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            className="w-full bg-muted/30 border border-border rounded-2xl pl-14 pr-6 py-4 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Access Tier</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                                        >
                                            <option value="user" className="bg-card">Limited User</option>
                                            {me?.role === 'super_admin' && (
                                                <option value="admin" className="bg-card">Administrator</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current Sync</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                                        >
                                            <option value="active" className="bg-card">Active Node</option>
                                            <option value="blocked" className="bg-card">Shielded/Blocked</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:opacity-95 active:scale-95 text-primary-foreground font-black py-5 rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all uppercase tracking-[0.2em] text-xs mt-6"
                                >
                                    Confirm Deployment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

