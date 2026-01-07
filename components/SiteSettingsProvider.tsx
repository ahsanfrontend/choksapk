'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SiteSettings {
    siteName: string;
    siteTagline: string;
    logoUrl?: string;
    logoDarkUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
        telegram?: string;
        whatsapp?: string;
    };
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    footerText?: string;
    copyrightText?: string;
    uiDesign?: 'classic' | 'modern' | 'vip';
}

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({ children, initialSettings }: { children: React.ReactNode, initialSettings: SiteSettings | null }) {
    const [settings, setSettings] = useState<SiteSettings | null>(initialSettings);

    useEffect(() => {
        if (!initialSettings) {
            fetch('/api/settings')
                .then(res => res.json())
                .then(data => {
                    if (!data.error) setSettings(data);
                })
                .catch(err => console.error('Settings fetch error:', err));
        }
    }, [initialSettings]);

    // Apply primary color to CSS variable
    useEffect(() => {
        if (settings?.primaryColor) {
            document.documentElement.style.setProperty('--primary', settings.primaryColor);
        }
    }, [settings]);

    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
