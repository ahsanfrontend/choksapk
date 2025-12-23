import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-muted border-t border-border py-12 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
                            CHOKS<span className="text-foreground">APK</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Premium choksapk referral and discovery platform. Explore top games and play responsibly on authorized platforms.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-widest">Navigation</h4>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
                            <li><Link href="/games/slots" className="hover:text-primary transition">Slots</Link></li>
                            <li><Link href="/games/table" className="hover:text-primary transition">Table Games</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition">Latest News</Link></li>
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

                    <div>
                        <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-widest">Social</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-card border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition shadow-sm">
                                <Facebook size={18} />
                            </Link>
                            <Link href="#" className="p-2 bg-card border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition shadow-sm">
                                <Twitter size={18} />
                            </Link>
                            <Link href="#" className="p-2 bg-card border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition shadow-sm">
                                <Instagram size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-muted-foreground text-xs font-medium">
                    &copy; {new Date().getFullYear()} choksapk. 18+ Only. Please gamble responsibly.
                </div>
            </div>
        </footer>

    );
}
