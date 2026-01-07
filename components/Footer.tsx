import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-muted border-t border-border py-12 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <Link href="/" className="text-lg md:text-2xl font-black text-primary uppercase tracking-tighter italic whitespace-nowrap flex-shrink-0 flex items-center gap-2">
                        <img src="/earn-apk.png" alt="" className="w-8 h-8 object-contain" />
                        CHOKS<span className="text-foreground not-italic font-bold">APK</span>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Verified repository for high-performance assets and secure distribution. Deploying excellence across the digital asset protection landscape.
                    </p>

                    <div>
                        <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-widest">Navigation</h4>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
                            <li><Link href="/games" className="hover:text-primary transition">All Games</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-widest">Support</h4>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li><Link href="/faq" className="hover:text-primary transition">FAQ</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
                        </ul>
                    </div>


                </div>

                <div className="border-t border-border pt-8 text-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} CHOKS APK. CERTIFIED ASSET PROTECTION PROTOCOL.
                </div>
            </div>
        </footer>

    );
}
