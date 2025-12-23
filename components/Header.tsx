'use client';
import Link from 'next/link';
import { Menu, Search, User } from 'lucide-react';
import { useState, useRef } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
                <Link href="/" className="text-lg md:text-2xl font-black text-primary uppercase tracking-tighter italic whitespace-nowrap flex-shrink-0">
                    CHOKS<span className="text-foreground not-italic font-bold">APK</span>
                </Link>

                <nav className="hidden lg:flex gap-8 items-center font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground mr-auto">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/games/slots" className="hover:text-primary transition-colors">Slots</Link>
                    <Link href="/games/table" className="hover:text-primary transition-colors">Table</Link>
                    <Link href="/blog" className="hover:text-primary transition-colors">Journal</Link>
                </nav>

                <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-md justify-end">
                    <form onSubmit={handleSearch} className="relative group flex items-center justify-end hidden sm:flex">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={isSearchFocused ? "Query Asset..." : ""}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className={`transition-all duration-500 ease-in-out font-black uppercase tracking-widest text-[9px] md:text-[10px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none h-10 ${isSearchFocused
                                ? 'w-full md:w-64 bg-muted/80 border-primary ring-4 ring-primary/10 pl-10 pr-4 border rounded-full'
                                : 'w-10 bg-muted/30 border-transparent pl-10 pr-0 cursor-pointer hover:bg-muted/50 rounded-full'
                                }`}
                        />
                        <button
                            type="submit"
                            onClick={(e) => {
                                if (!isSearchFocused) {
                                    e.preventDefault();
                                    searchInputRef.current?.focus();
                                }
                            }}
                            className={`absolute left-0 top-0 bottom-0 px-3 flex items-center justify-center transition-colors duration-300 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground scale-110'}`}
                        >
                            <Search size={16} />
                        </button>
                    </form>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        <button className="sm:hidden p-2 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Search size={20} />
                        </button>

                        <button className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-card border-t border-border p-6 shadow-2xl animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleSearch} className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search Repository..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted border border-border rounded-2xl py-3.5 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary transition-all"
                        />
                        <button type="submit" className="absolute left-0 top-0 bottom-0 px-4 flex items-center justify-center text-muted-foreground active:text-primary transition-colors">
                            <Search size={18} />
                        </button>
                    </form>
                    <div className="flex flex-col gap-5">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors">Home</Link>
                        <Link href="/games/slots" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors">Slots</Link>
                        <Link href="/games/table" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors">Table Games</Link>
                        <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors">Journal</Link>
                        <div className="pt-6 border-t border-border flex justify-end items-center">
                            <Link href="/login" className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Operator Login</Link>
                        </div>
                    </div>
                </div>
            )}
        </header>

    );
}
