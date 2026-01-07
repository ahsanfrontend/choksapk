import { Metadata } from 'next';

interface SiteSettingsData {
    siteName: string;
    siteTagline: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    faviconUrl?: string;
    logoUrl?: string;
    logoDarkUrl?: string;
    ogImageUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
        telegram?: string;
        whatsapp?: string;
    };
    footerText?: string;
    copyrightText?: string;
}

interface GenerateMetadataOptions {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    path?: string;
    type?: 'website' | 'article';
}

export async function generateDynamicMetadata(
    settings: SiteSettingsData | null,
    options: GenerateMetadataOptions = {}
): Promise<Metadata> {
    const siteName = settings?.siteName || 'choksapk';
    const siteTagline = settings?.siteTagline || 'Premium Asset Distribution Protocol';

    const title = options.title
        ? `${options.title} | ${siteName}`
        : settings?.metaTitle || `${siteName} | ${siteTagline}`;

    const description = options.description
        || settings?.metaDescription
        || `Verified repository for high-performance assets, gaming protocols, and secure distribution. Deploy excellence with ${siteName}.`;

    const keywords = options.keywords
        || settings?.metaKeywords
        || ['gaming', 'casino', 'assets', 'premium'];

    const ogImage = options.image
        || settings?.ogImageUrl
        || settings?.logoUrl
        || '/earn-apk.png';

    const favicon = settings?.faviconUrl || '/earn-apk.png';

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://choksapk.vercel.app';
    const url = options.path ? `${baseUrl}${options.path}` : baseUrl;

    return {
        title,
        description,
        keywords: keywords.join(', '),
        authors: [{ name: siteName }],
        creator: siteName,
        publisher: siteName,
        applicationName: siteName,

        icons: {
            icon: favicon,
            apple: favicon,
            shortcut: favicon,
        },

        manifest: '/api/manifest',

        openGraph: {
            type: options.type || 'website',
            url,
            title,
            description,
            siteName,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: siteName,
                }
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
            creator: `@${siteName}`,
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        alternates: {
            canonical: url,
        },

        ...(settings?.primaryColor && {
            themeColor: settings.primaryColor,
        }),
    };
}

// Helper function to fetch site settings for metadata
export async function getSiteSettings(): Promise<SiteSettingsData | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/settings`, {
            cache: 'no-store',
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch site settings for metadata:', error);
        return null;
    }
}
