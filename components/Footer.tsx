'use client';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Send, Mail, MapPin, Phone, ShieldCheck, Globe, Zap } from 'lucide-react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

export default function Footer() {
    const settings = useSiteSettings();
    const uiDesign = settings?.uiDesign || 'vip';

    const siteName = settings?.siteName || 'CHOKS APK';
    const logoUrl = settings?.logoUrl || '/earn-apk.png';
    const copyrightText = settings?.copyrightText || `© ${new Date().getFullYear()} ${siteName}. CERTIFIED ASSET PROTECTION PROTOCOL.`;
    const socialLinks = settings?.socialLinks || {};

    return (
        <footer className={`transition-all duration-500 border-t ${uiDesign === 'vip' ? 'bg-muted/50 border-primary/10 py-20 relative overflow-hidden' :
            uiDesign === 'modern' ? 'bg-muted border-border py-16' :
                'bg-card border-border py-12'
            }`}>
            {uiDesign === 'vip' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            )}

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className={`flex items-center gap-3 transition-transform active:scale-95 ${uiDesign === 'vip' ? 'text-2xl font-black text-primary uppercase tracking-tighter italic' :
                            'text-xl font-bold text-foreground uppercase tracking-tight'
                            }`}>
                            <div className={`${uiDesign === 'vip' ? 'p-1.5 bg-primary/10 rounded-xl border border-primary/20 shadow-inner' : ''}`}>
                                <img src={logoUrl} alt="" className="w-8 h-8 object-contain" />
                            </div>
                            <span>{siteName}</span>
                        </Link>

                        <p className={`leading-relaxed ${uiDesign === 'vip' ? 'text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider' : 'text-sm text-muted-foreground'}`}>
                            {settings?.siteTagline || 'Verified repository for high-performance assets and secure distribution. Deploying excellence across the digital landscape.'}
                        </p>

                        <div className="flex gap-4">
                            {[
                                { icon: <Facebook size={18} />, href: socialLinks.facebook },
                                { icon: <Twitter size={18} />, href: socialLinks.twitter },
                                { icon: <Instagram size={18} />, href: socialLinks.instagram },
                                { icon: <Youtube size={18} />, href: socialLinks.youtube },
                                { icon: <Send size={18} />, href: socialLinks.telegram }
                            ].map((social, i) => social.href && (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className={`w-10 h-10 flex items-center justify-center transition-all ${uiDesign === 'vip'
                                        ? 'bg-primary/5 border border-primary/20 text-muted-foreground hover:text-primary hover:border-primary rounded-xl'
                                        : 'bg-muted text-muted-foreground hover:text-primary rounded-full'
                                        }`}
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className={`font-black uppercase tracking-[0.2em] mb-8 ${uiDesign === 'vip' ? 'text-[10px] text-primary' : 'text-xs text-foreground'}`}>Intelligence Hub</h4>
                        <ul className={`space-y-4 ${uiDesign === 'vip' ? 'text-[10px] font-black uppercase tracking-widest' : 'text-sm'}`}>
                            <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">{uiDesign === 'vip' && <Globe size={12} />} Home</Link></li>
                            <li><Link href="/games" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">{uiDesign === 'vip' && <ShieldCheck size={12} />} All Games </Link></li>
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">{uiDesign === 'vip' && <Zap size={12} />} Intelligence</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-black uppercase tracking-[0.2em] mb-8 ${uiDesign === 'vip' ? 'text-[10px] text-primary' : 'text-xs text-foreground'}`}>Legal Protocols</h4>
                        <ul className={`space-y-4 ${uiDesign === 'vip' ? 'text-[10px] font-black uppercase tracking-widest' : 'text-sm'}`}>
                            <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Engagement</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Shield</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-black uppercase tracking-[0.2em] mb-8 ${uiDesign === 'vip' ? 'text-[10px] text-primary' : 'text-xs text-foreground'}`}>Contact Point</h4>
                        <ul className={`space-y-4 ${uiDesign === 'vip' ? 'text-[10px] font-black uppercase tracking-widest' : 'text-sm'}`}>
                            {settings?.contactEmail && (
                                <li className="flex items-center gap-3 text-muted-foreground italic">
                                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                        <Mail size={14} />
                                    </div>
                                    <span className="truncate">{settings.contactEmail}</span>
                                </li>
                            )}
                            {settings?.contactPhone && (
                                <li className="flex items-center gap-3 text-muted-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                        <Phone size={14} />
                                    </div>
                                    <span>{settings.contactPhone}</span>
                                </li>
                            )}
                            {settings?.address && (
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 mt-1 flex-shrink-0">
                                        <MapPin size={14} />
                                    </div>
                                    <span>{settings.address}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className={`pt-10 border-t ${uiDesign === 'vip' ? 'border-primary/10' : 'border-border'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] text-center md:text-left">
                            {copyrightText}
                        </p>
                        {uiDesign === 'vip' && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full shadow-inner">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[8px] font-black text-foreground uppercase tracking-widest">Master Node Secure</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
