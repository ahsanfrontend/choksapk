import dbConnect from './mongodb';
import PageMetadata from '@/models/PageMetadata';
import { Metadata } from 'next';

export async function getMetadataForPath(path: string, fallback?: Partial<Metadata>): Promise<Metadata> {
    try {
        await dbConnect();
        const meta = await PageMetadata.findOne({ routePath: path });

        if (meta) {
            return {
                title: meta.title || fallback?.title || 'choksapk',
                description: meta.description || fallback?.description || 'Premium Asset Hub',
                keywords: meta.keywords || fallback?.keywords || '',
                openGraph: {
                    title: meta.title,
                    description: meta.description,
                    images: meta.ogImage ? [{ url: meta.ogImage }] : undefined,
                },
                twitter: {
                    card: 'summary_large_image',
                    title: meta.title,
                    description: meta.description,
                    images: meta.ogImage ? [meta.ogImage] : undefined,
                }
            };
        }
    } catch (error) {
        console.error('Metadata Fetch Error:', error);
    }

    // Default fallback
    return {
        title: fallback?.title || 'choksapk',
        description: fallback?.description || 'Built with Next.js and MongoDB',
        ...fallback
    };
}
