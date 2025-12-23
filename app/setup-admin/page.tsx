'use client';
import { useState } from 'react';

export default function SetupAdminPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/setup/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
            setMessage(data.message);
        } else {
            setMessage(data.error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-white mb-4">Setup Admin User</h1>
                <p className="text-slate-400 mb-6 text-sm">Enter the email address of the registered user you want to promote to Admin.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white"
                        required
                    />
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded">
                        Make Admin
                    </button>
                </form>

                {message && (
                    <div className="mt-4 p-3 bg-slate-900 rounded text-amber-500 text-center">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
