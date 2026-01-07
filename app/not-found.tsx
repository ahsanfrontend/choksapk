'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    useEffect(() => {
        // Track 404 Event
        const track404 = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventType: '404',
                        path: window.location.pathname,
                        entityType: 'page'
                    }),
                });
            } catch (err) {
                // Silent
            }
        };
        track404();
    }, []);

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                    <AlertTriangle size={80} className="text-primary relative z-10 mx-auto animate-bounce" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-foreground uppercase tracking-tighter italic">404</h1>
                    <h2 className="text-xl font-bold text-foreground uppercase tracking-widest italic">Protocol Broken</h2>
                    <p className="text-muted-foreground font-medium">The endpoint you are attempting to reach does not exist or has been shifted in the network.</p>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-primary/20"
                >

                    
                    <Home size={18} /> Return Home
                </Link>
            </div>
        </div>
    );
}
