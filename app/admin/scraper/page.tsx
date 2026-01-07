'use client';

import { useState } from 'react';
import { Globe, Download, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react';

export default function ScraperPage() {
    const [urls, setUrls] = useState('');
    const [selector, setSelector] = useState('.game-item');
    const [mode, setMode] = useState<'single' | 'listing'>('single');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [useAiBranding, setUseAiBranding] = useState(true);

    const handleScrape = async () => {
        const urlList = urls.split('\n').map(u => u.trim()).filter(u => u);

        if (urlList.length === 0) {
            alert('Please enter at least one URL');
            return;
        }

        setLoading(true);
        setResult(null);
        setProgress({ current: 0, total: urlList.length });

        const allResults = {
            total: 0,
            imported: 0,
            skipped: 0,
            errors: [] as string[],
            preview: [] as any[]
        };

        for (let i = 0; i < urlList.length; i++) {
            const url = urlList[i];
            setProgress({ current: i + 1, total: urlList.length });

            try {
                const res = await fetch('/api/scraper', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, selector, mode, useAiBranding })
                });

                const data = await res.json();

                if (res.ok) {
                    allResults.total += data.total || 0;
                    allResults.imported += data.imported || 0;
                    allResults.skipped += data.skipped || 0;
                    if (data.errors) allResults.errors.push(...data.errors);
                    if (data.preview) allResults.preview.push(...data.preview);
                } else {
                    allResults.errors.push(`${url}: ${data.error || 'Failed'}`);
                }
            } catch (err: any) {
                allResults.errors.push(`${url}: ${err.message}`);
            }

            // Small delay between requests to avoid overwhelming the server
            if (i < urlList.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        setResult(allResults);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter italic mb-3 flex items-center gap-4">
                        <Globe className="text-primary" size={40} />
                        Asset Scraper
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base font-medium">
                        Extract game data from external websites and import them into your vault. Paste multiple URLs (one per line) for batch scraping.
                    </p>
                </div>

                {/* Scraper Form */}
                <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-xl mb-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-1">
                                Target URLs (One per line)
                            </label>
                            <textarea
                                value={urls}
                                onChange={(e) => setUrls(e.target.value)}
                                placeholder="https://example.com/game-1&#10;https://example.com/game-2&#10;https://example.com/game-3"
                                rows={6}
                                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono text-sm resize-none"
                            />
                            <p className="text-[9px] text-muted-foreground font-medium ml-2 mt-2 uppercase tracking-widest">
                                Paste one URL per line. All URLs will be scraped sequentially.
                            </p>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-1">
                                CSS Selector (Optional)
                            </label>
                            <input
                                type="text"
                                value={selector}
                                onChange={(e) => setSelector(e.target.value)}
                                placeholder=".game-item"
                                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono text-sm"
                            />
                            <p className="text-[9px] text-muted-foreground font-medium ml-2 mt-2 uppercase tracking-widest">
                                Leave empty to use auto-detection. Common selectors: .game-item, .product, article
                            </p>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-1">
                                Scrape Mode
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMode('single')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'single'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    Single Game
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('listing')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'listing'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    Multiple Games
                                </button>
                            </div>
                        </div>

                        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-foreground uppercase tracking-widest">AI Image Branding</h4>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight mt-0.5">Automated "ear-apk.com" watermark injection</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={useAiBranding}
                                    onChange={(e) => setUseAiBranding(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-muted rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <button
                            onClick={handleScrape}
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-2xl uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    {progress.total > 0 ? `Scraping ${progress.current}/${progress.total}...` : 'Extracting Data...'}
                                </>
                            ) : (
                                <>
                                    <Download size={20} />
                                    Start Batch Scraping
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results */}
                {result && (
                    <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-xl">
                        {result.error ? (
                            <div className="flex items-start gap-4 text-red-500">
                                <XCircle size={24} className="flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-black uppercase tracking-wider mb-2">Scraping Failed</h3>
                                    <p className="text-sm text-muted-foreground">{result.error}</p>
                                    {result.suggestions && (
                                        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                                            {result.suggestions.map((s: string, i: number) => (
                                                <li key={i}>• {s}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <CheckCircle size={32} className="text-emerald-500" />
                                    <div>
                                        <h3 className="font-black text-xl uppercase tracking-tight text-foreground">
                                            Scraping Complete
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {result.total} items found • {result.imported} imported • {result.skipped} skipped
                                        </p>
                                    </div>
                                </div>

                                {result.errors && result.errors.length > 0 && (
                                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mb-6">
                                        <h4 className="font-black text-sm text-destructive uppercase mb-2">Errors ({result.errors.length})</h4>
                                        <div className="space-y-1 text-xs text-muted-foreground max-h-40 overflow-y-auto">
                                            {result.errors.map((err: string, i: number) => (
                                                <div key={i} className="font-mono">• {err}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {result.preview && result.preview.length > 0 && (
                                    <div>
                                        <h4 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4">
                                            Preview (First 5 Items)
                                        </h4>
                                        <div className="space-y-4">
                                            {result.preview.map((game: any, i: number) => (
                                                <div key={i} className="bg-muted/30 border border-border rounded-2xl p-4 flex items-start gap-4">
                                                    {game.thumbnail && (
                                                        <img
                                                            src={game.thumbnail}
                                                            alt={game.title}
                                                            className="w-16 h-16 rounded-lg object-cover border border-border"
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-black text-sm text-foreground uppercase truncate">{game.title}</h5>
                                                        <p className="text-xs text-muted-foreground mt-1 truncate">{game.provider}</p>
                                                        <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2">{game.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t border-border flex gap-4">
                                    <button
                                        onClick={() => setResult(null)}
                                        className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-black py-3 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Clear
                                    </button>
                                    <a
                                        href="/admin/games"
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black py-3 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={16} />
                                        View Assets
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
