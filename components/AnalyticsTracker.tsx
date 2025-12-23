'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Track page visit
        const trackVisit = async () => {
            try {
                // Determine entity type based on path
                let entityType: 'page' | 'game' | 'blog' = 'page';
                if (pathname.startsWith('/game/')) entityType = 'game';
                else if (pathname.startsWith('/blog/')) entityType = 'blog';

                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventType: 'visit',
                        path: pathname,
                        entityType
                    }),
                });
            } catch (err) {
                // Silent fail for analytics
            }
        };

        // Don't track admin or api routes
        if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
            trackVisit();
        }
    }, [pathname]);

    return null;
}
