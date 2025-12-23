import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import BlogPost, { IBlogPost } from '@/models/BlogPost';

export const dynamic = 'force-dynamic';

export default async function BlogsAdminPage() {
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Editorial <span className="text-primary italic">Control</span></h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Draft, schedule, and publish insights to the choksapk Journal.</p>
                </div>
                <Link href="/admin/blogs/new" className="px-8 py-3 bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 transition-all">
                    <Plus size={18} /> Draft New Story
                </Link>
            </div>

            <div className="bg-card rounded-[2rem] border border-border shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Article Title</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Publication Status</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date Modified</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {posts.map((post) => (
                                <tr key={post._id as string} className="hover:bg-muted/30 transition-colors group">
                                    <td className="p-6">
                                        <span className="font-black text-sm text-foreground uppercase tracking-tight leading-tight line-clamp-1">{post.title}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            {new Date(post.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-foreground">
                                            <Link href={`/admin/blogs/${post._id}`} className="p-3 hover:bg-muted rounded-xl transition-all hover:text-primary">
                                                <Edit size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center">
                                        <p className="text-muted-foreground font-black uppercase tracking-[0.2em]">No editorial entries found</p>
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
