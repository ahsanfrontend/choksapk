'use client';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Send } from 'lucide-react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

export default function Footer() {
    const settings = useSiteSettings();

    const siteName = settings?.siteName || 'CHOKS APK';
    const logoUrl = settings?.logoUrl || '/earn-apk.png';
    const copyrightText = settings?.copyrightText || `© ${new Date().getFullYear()} ${siteName}. CERTIFIED ASSET PROTECTION PROTOCOL.`;
    const socialLinks = settings?.socialLinks || {};

    return (
        <footer className="bg-muted border-t border-border py-12 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="text-lg md:text-2xl font-black text-primary uppercase tracking-tighter italic whitespace-nowrap flex-shrink-0 flex items-center gap-2 mb-4">
                            <img src={logoUrl} alt="" className="w-8 h-8 object-contain" />
                            {siteName}
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            {settings?.siteTagline || 'Verified repository for high-performance assets and secure distribution. Deploying excellence across the digital landscape.'}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.facebook && <Link href={socialLinks.facebook} className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={18} /></Link>}
                            {socialLinks.twitter && <Link href={socialLinks.twitter} className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={18} /></Link>}
                            {socialLinks.instagram && <Link href={socialLinks.instagram} className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={18} /></Link>}
                            {socialLinks.youtube && <Link href={socialLinks.youtube} className="text-muted-foreground hover:text-primary transition-colors"><Youtube size={18} /></Link>}
                            {socialLinks.telegram && <Link href={socialLinks.telegram} className="text-muted-foreground hover:text-primary transition-colors"><Send size={18} /></Link>}
                        </div>
                    </div>

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

                    <div>
                        <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-widest">Contact</h4>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            {settings?.contactEmail && <li>Email: {settings.contactEmail}</li>}
                            {settings?.contactPhone && <li>Phone: {settings.contactPhone}</li>}
                            {settings?.address && <li>{settings.address}</li>}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                    {copyrightText}
                </div>
            </div>
        </footer>
    );
}
