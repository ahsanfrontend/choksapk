import Link from 'next/link';
import { Plus, Edit, Newspaper, Sparkles, Terminal } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { getSiteSettings } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export default async function BlogsAdminPage() {
    const settings = await getSiteSettings();
    const uiDesign = settings?.uiDesign || 'vip';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let posts: any[] = [];
    try {
        await dbConnect();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posts = await BlogPost.find({}).sort({ createdAt: -1 }) as any;
    } catch (error) {
        console.error("Admin Blogs List DB Error, using mock data:", error);
        posts = Array(5).fill(null).map((_, i) => ({
            _id: `mock-admin-post-${i}`,
            title: `Demo Blog Post ${i + 1}`,
            slug: `demo-category-${i + 1}`,
            content: '',
            excerpt: '',
            status: i % 2 === 0 ? 'published' : 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0
        }));
    }

    const cardRadius = uiDesign === 'vip' ? 'rounded-[2.5rem]' : uiDesign === 'modern' ? 'rounded-3xl' : 'rounded-xl';

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className={`font-black text-foreground uppercase tracking-tighter italic ${uiDesign === 'vip' ? 'text-4xl md:text-6xl' : 'text-3xl md:text-5xl'
                            }`}>
                            {uiDesign === 'vip' ? 'Editorial' : 'Blog'} <span className="text-primary italic">{uiDesign === 'vip' ? 'Synthesis' : 'Control'}</span>
                        </h1>
                        {uiDesign === 'vip' && <Sparkles className="text-primary animate-pulse" size={24} />}
                    </div>
                    <p className="text-muted-foreground text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">
                        {uiDesign === 'vip' ? 'Draft, schedule, and publish data transmissions to the journal node' : 'Manage your site blog posts and articles'}
                    </p>
                </div>
                <Link
                    href="/admin/blogs/new"
                    className={`px-10 py-4 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-black text-xs uppercase tracking-[0.25em] flex items-center gap-3 shadow-2xl shadow-primary/30 transition-all ${uiDesign === 'vip' ? 'rounded-2xl' : 'rounded-xl'}`}
                >
                    <Plus size={18} /> {uiDesign === 'vip' ? 'DRAFT NEW SEQUENCE' : 'CREATE NEW POST'}
                </Link>
            </div>

            <div className={`bg-card border border-border shadow-2xl overflow-hidden ${cardRadius}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${uiDesign === 'vip' ? 'bg-muted/30' : 'bg-muted/50'} border-b border-border`}>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">Journal Entry Title</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">Publish State</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">Node Modification</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {posts.map((post) => (
                                <tr key={post._id as string} className="hover:bg-muted/20 transition-all group duration-500">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-muted rounded-xl text-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                                                <Newspaper size={18} />
                                            </div>
                                            <span className="font-black text-sm text-foreground uppercase tracking-tight leading-tight line-clamp-1 italic group-hover:text-primary transition-colors">{post.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${post.status === 'published'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }`}>
                                                {post.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <Terminal size={12} className="text-muted-foreground/40" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic opacity-60">
                                                {new Date(post.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                            <Link
                                                href={`/admin/blogs/${post._id}`}
                                                className={`p-3.5 hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-2xl transition-all text-muted-foreground hover:text-primary shadow-sm`}
                                                title="Modify Sequence"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center border border-border shadow-inner">
                                                <Newspaper size={32} className="text-muted-foreground" />
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-[0.4em] italic text-muted-foreground">Zero Node Communications Indexed</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
