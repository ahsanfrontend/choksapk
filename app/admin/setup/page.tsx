'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, UserPlus, Lock, Mail, User } from 'lucide-react';

export default function AdminSetupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/setup/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-card border border-border rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                <div className="relative z-10 text-center mb-12">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-xl shadow-primary/5">
                        <ShieldAlert size={40} className="text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter italic italic">System <span className="text-primary italic">Initialization</span></h1>
                    <p className="text-muted-foreground text-sm font-medium mt-2 uppercase tracking-widest">Establish Supreme Administrative Access</p>
                </div>

                {error && (
                    <div className="relative z-10 mb-8 p-5 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-4 text-destructive text-xs font-black uppercase tracking-widest animate-shake">
                        <ShieldAlert size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="IDENTITY NAME"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-foreground font-black text-xs uppercase tracking-[0.2em] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="ACCESS EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-foreground font-black text-xs uppercase tracking-[0.2em] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="SECURITY CODE"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-foreground font-black text-xs uppercase tracking-[0.2em] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-foreground text-background font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-foreground/20 disabled:opacity-50"
                    >
                        {loading ? 'Initializing...' : <><UserPlus size={18} /> Authorize Admin</>}
                    </button>
                </form>

                <div className="relative z-10 mt-10 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                        * SECURE ENCRYPTED HANDSHAKE IN PROGRESS *
                    </p>
                </div>
            </div>
        </div>
    );
}

