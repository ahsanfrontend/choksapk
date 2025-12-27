import React from 'react';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/faq', {
        title: 'FAQ | choksapk - Knowledge Base',
        description: 'Frequently asked questions about our gaming asset platform.'
    });
}

export default function FAQPage() {
    const faqs = [
        {
            q: "What is choksapk?",
            a: "choksapk is a premium discovery platform for high-quality gaming assets and repository access. We curate the best titles and provide direct links to authorized distribution nodes."
        },
        {
            q: "Are the downloads safe?",
            a: "Yes. Every asset listed on our platform undergoes a rigorous integrity check. We provide SHA-256 validated signatures to ensure the source code hasn't been tampered with."
        },
        {
            q: "How do I access the Master Repository?",
            a: "Simply navigate to any game detail page and click the 'Download Protocol' button. This will securely route you to the encrypted branch for that specific asset."
        },
        {
            q: "Is registration required?",
            a: "While you can browse the inventory freely, registered users get access to advanced management tools and real-time update notifications."
        },

    ];

    return (
        <div className="bg-background min-h-screen py-20 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter italic mb-4">
                        General <span className="text-primary not-italic">Reference</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-primary rounded-full mx-auto mb-8"></div>
                    <p className="text-muted-foreground font-medium text-lg">
                        Common inquiries regarding our encrypted inventory and access protocols.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-card border border-border rounded-[2rem] p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all group">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-4 flex items-start gap-4">
                                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-1 italic">Q</span>
                                {faq.q}
                            </h3>
                            <div className="flex items-start gap-4">
                                <span className="bg-emerald-500/10 text-emerald-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-1 italic">A</span>
                                <p className="text-muted-foreground leading-relaxed font-medium">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}
