'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        featuredImage: initialData?.featuredImage || '',
        tags: initialData?.tags?.join(', ') || '',
        status: initialData?.status || 'draft',
        seoTitle: initialData?.seoTitle || '',
        seoDescription: initialData?.seoDescription || '',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateSlug = () => {
        const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: data });
            const json = await res.json();
            if (json.url) {
                setFormData(prev => ({ ...prev, featuredImage: json.url }));
            }
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const url = initialData ? `/api/blogs/${initialData._id}` : '/api/blogs';
        const method = initialData ? 'PUT' : 'POST';

        const payload = {
            ...formData,
            tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        };

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            router.refresh();
            router.push('/admin/blogs');
        } else {
            alert('Failed to save');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-3">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Editorial Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} onBlur={generateSlug} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" required placeholder="e.g. Master the Strategy" />
                </div>
                <div className="space-y-3">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Canonical Slug</label>
                    <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" required placeholder="mastering-strategy" />
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Cover Narrative (URL)</label>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input type="text" name="featuredImage" value={formData.featuredImage} onChange={handleChange} className="flex-1 bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium" placeholder="https://cdn.example.com/cover.png" />
                    <label className="cursor-pointer bg-foreground text-background font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shadow-xl shadow-foreground/10">
                        Upload Cover
                        <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                    </label>
                </div>
                {formData.featuredImage && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-[2rem] inline-block border border-border group overflow-hidden">
                        <img src={formData.featuredImage} alt="Preview" className="h-24 w-auto object-contain transition-transform group-hover:scale-110" />
                    </div>
                )}
            </div>

            <div className="space-y-3 relative z-10">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Article Manuscript (Markdown)</label>
                <textarea name="content" value={formData.content} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-3xl px-8 py-6 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono text-sm h-96 resize-none leading-relaxed" required placeholder="Compose your story here..." />
            </div>

            <div className="space-y-3 relative z-10">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Strategic Excerpt</label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-8 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium h-24 resize-none leading-relaxed" placeholder="A concise summary for teasers..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-3">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Classification Tags</label>
                    <input name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" placeholder="news, strategy, gaming" />
                </div>
                <div className="space-y-3">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Release Protocol</label>
                    <div className="relative">
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-black uppercase tracking-widest appearance-none cursor-pointer">
                            <option value="draft">Draft Protocol</option>
                            <option value="published">Deploy Publicly</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 bg-muted/30 rounded-[2rem] p-8 border border-border">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <span className="w-8 h-px bg-primary"></span> Optimization Suite
                </h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Meta Identity</label>
                        <input name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Meta Narrative</label>
                        <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium h-24 resize-none" />
                    </div>
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary hover:opacity-95 active:scale-[0.98] text-primary-foreground px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/30 transition-all disabled:opacity-50 relative z-10">
                {loading ? 'Transmitting Data...' : 'Finalize Editorial Release'}
            </button>
        </form>
    );
}
