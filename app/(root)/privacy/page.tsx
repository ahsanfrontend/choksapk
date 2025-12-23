import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/privacy', {
        title: 'Privacy Policy | choksapk',
        description: 'Privacy protocols and data protection standards.'
    });
}

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl text-slate-300">
            <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
            <p className="mb-4">We do not collect any personal data other than what you provide for the demo login.</p>
            <p className="mb-4">This is a demonstration site.</p>
        </div>
    )
}
