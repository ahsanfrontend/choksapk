import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
    try {
        await dbConnect();
        const settings = await SiteSettings.findOne();

        const siteName = settings?.siteName || 'choksapk';
        const siteTagline = settings?.siteTagline || 'Premium Asset Distribution Protocol';
        const favicon = settings?.faviconUrl || '/earn-apk.png';
        const primaryColor = settings?.primaryColor || '#DDA430';
        const secondaryColor = settings?.secondaryColor || '#101010';

        const manifest = {
            name: `${siteName} | ${siteTagline}`,
            short_name: siteName,
            description: settings?.metaDescription || `Verified repository for high-performance assets and secure distribution protocols.`,
            start_url: '/',
            display: 'standalone',
            background_color: secondaryColor,
            theme_color: primaryColor,
            orientation: 'portrait-primary',
            scope: '/',
            icons: [
                {
                    src: favicon,
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any maskable'
                },
                {
                    src: favicon,
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable'
                }
            ],
            categories: ['entertainment', 'games', 'lifestyle'],
            screenshots: settings?.ogImageUrl ? [
                {
                    src: settings.ogImageUrl,
                    sizes: '1280x720',
                    type: 'image/png'
                }
            ] : []
        };

        return NextResponse.json(manifest, {
            headers: {
                'Content-Type': 'application/manifest+json',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (error) {
        console.error('Manifest generation error:', error);

        // Fallback manifest
        return NextResponse.json({
            name: 'choksapk | Premium Asset Distribution Protocol',
            short_name: 'choksapk',
            start_url: '/',
            display: 'standalone',
            background_color: '#101010',
            theme_color: '#DDA430',
            icons: [
                {
                    src: '/earn-apk.png',
                    sizes: '192x192',
                    type: 'image/png'
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/manifest+json'
            }
        });
    }
}
