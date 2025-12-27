'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.user.role === 'admin') {
                localStorage.setItem('adminToken', data.token); // Save token for client-side API calls
                router.push('/admin/dashboard');
            } else {
                localStorage.setItem('token', data.token); // Save regular token
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
            <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Admin Login</h1>
                {error && <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                    {error}
                </div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-muted-foreground">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-muted-foreground">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-primary hover:opacity-90 active:scale-[0.98] text-primary-foreground font-bold rounded-lg shadow-md shadow-primary/20 transition-all mt-4"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                        Secure access for administrators only
                    </p>
                </div>
            </div>
        </div>
    );

}
