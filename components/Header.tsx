'use client';
import Link from 'next/link';
import { Menu, Search, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Fetch suggestions with debounce
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            setIsLoadingSuggestions(true);
            try {
                const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                }
            } catch (error) {
                console.error('Suggestions Error:', error);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
            setIsSearchFocused(false);
            setSuggestions([]);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
                <Link href="/" className="text-lg md:text-2xl font-black text-primary uppercase tracking-tighter italic whitespace-nowrap flex-shrink-0 flex items-center gap-2">
                    <img src="/earn-apk.png" alt="" className="w-8 h-8 object-contain" />
                    CHOKS<span className="text-foreground not-italic font-bold">APK</span>
                </Link>

                <nav className="hidden lg:flex gap-8 items-center font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground mr-auto">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/games" className="hover:text-primary transition-colors">Route Vault</Link>
                    <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
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

                        {/* Suggestions Dropdown (Desktop) */}
                        {isSearchFocused && searchQuery.length >= 2 && (suggestions.length > 0 || isLoadingSuggestions) && (
                            <div
                                ref={suggestionsRef}
                                className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
                            >
                                {isLoadingSuggestions ? (
                                    <div className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Scanning Database...</div>
                                ) : (
                                    suggestions.map((game) => (
                                        <button
                                            key={game.slug}
                                            onMouseDown={() => {
                                                router.push(`/game/${game.slug}`);
                                                setIsSearchFocused(false);
                                                setSearchQuery('');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left transition-colors group"
                                        >
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border group-hover:border-primary/50 transition-colors">
                                                <img src={game.thumbnail} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] font-black text-foreground uppercase truncate group-hover:text-primary transition-colors">{game.title}</div>
                                                <div className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest truncate">{game.provider}</div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
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

                        {/* Mobile Suggestions */}
                        {searchQuery.length >= 2 && (suggestions.length > 0 || isLoadingSuggestions) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-muted border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                                {isLoadingSuggestions ? (
                                    <div className="px-5 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Searching...</div>
                                ) : (
                                    suggestions.map((game) => (
                                        <button
                                            key={game.slug}
                                            onClick={() => {
                                                router.push(`/game/${game.slug}`);
                                                setMobileMenuOpen(false);
                                                setSearchQuery('');
                                            }}
                                            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-background border-b border-border/50 last:border-0 text-left"
                                        >
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-background flex-shrink-0 border border-border">
                                                <img src={game.thumbnail} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[11px] font-black text-foreground uppercase truncate">{game.title}</div>
                                                <div className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">{game.provider}</div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </form>
                    <div className="flex flex-col gap-5">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors">Home</Link>
                        <Link href="/games" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors">Route Vault</Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-black text-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors">About Us</Link>
                    </div>
                </div>
            )}
        </header>

    );
}
