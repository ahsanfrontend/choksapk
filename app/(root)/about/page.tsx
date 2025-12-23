import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/about', {
        title: 'About | choksapk - Our Protocol',
        description: 'Learn about the mission and technology behind the choksapk repository.'
    });
}

export default function AboutPage() {
    return (
        <div className="bg-background min-h-[70vh] py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-card border border-border rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>

                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-10 uppercase tracking-tighter italic">About <span className="text-primary">choksapk</span></h1>

                    <div className="space-y-8 text-muted-foreground font-medium leading-relaxed text-lg relative z-10">
                        <p>
                            Welcome to <span className="text-foreground font-bold">choksapk</span>, the ultimate demonstration platform for high-end online gaming discovery.
                        </p>
                        <p>
                            This project represents a sophisticated integration of modern web technologies, showcasing a seamless blend of <span className="text-foreground">Next.js</span>, <span className="text-foreground">React</span>, <span className="text-foreground">Tailwind CSS</span>, and <span className="text-foreground">MongoDB</span>. Our mission is to provide an elite, secure, and visually stunning portal for exploring the gaming landscape.
                        </p>

                        <div className="bg-muted/50 border border-border rounded-2xl p-8 mt-12">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full"></span> Regulatory Handshake
                            </h3>
                            <p className="text-sm italic">
                                <strong>Disclaimer:</strong> choksapk is a strictly non-monetary demonstration environment. No real-currency wagering occurs within this domain. All assets are simulations intended for illustrative and referral purposes only. No financial transactions are processed on this platform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
