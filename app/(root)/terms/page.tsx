import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/terms', {
        title: 'Terms of Service | choksapk',
        description: 'Acceptable use protocols and licensing agreements.'
    });
}

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl text-slate-300">
            <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
            <p className="mb-4">1. Acceptance of Terms: By accessing this demo, you agree it is for educational purposes only.</p>
            <p className="mb-4">2. No Gambling: No real money is involved.</p>
            <p className="mb-4">3. Content: Game images and descriptions are for demonstration.</p>
        </div>
    )
}
