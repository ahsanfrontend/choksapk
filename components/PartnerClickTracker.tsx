'use client';

import React from 'react';

interface PartnerClickTrackerProps {
    children: React.ReactNode;
    gameId?: string;
    path: string;
}

export default function PartnerClickTracker({ children, gameId, path }: PartnerClickTrackerProps) {
    const handleClick = async () => {
        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType: 'click',
                    path: path,
                    entityId: gameId,
                    entityType: 'game'
                }),
            });
        } catch (err) {
            // Silent
        }
    };

    return (
        <div onClick={handleClick} className="w-full">
            {children}
        </div>
    );
}
