import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/blog', {
        title: 'Journal | choksapk - Industry Intelligence',
        description: 'Latest news, strategies, and updates from the gaming world.'
    });
}

export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 }) as any[];

    return (
        <div className="bg-background min-h-screen py-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-5xl font-black text-foreground mb-6 uppercase tracking-tight italic">choksapk <span className="text-primary">Journal</span></h1>
                    <p className="text-muted-foreground font-medium">Expert analysis, industry news, and winning strategies from the world's leading gaming authorities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map(post => (
                        <Link href={`/blog/${post.slug}`} key={post._id.toString()} className="group block bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500">
                            <div className="h-56 bg-muted overflow-hidden relative">
                                {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover transition duration-1000 group-hover:scale-105" />}
                                <div className="absolute top-4 left-4">
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags?.slice(0, 2).map((tag: string) => (
                                            <span key={tag} className="text-[9px] font-black text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <h2 className="text-2xl font-black text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-tight uppercase">{post.title}</h2>
                                <p className="text-muted-foreground line-clamp-3 mb-8 text-sm font-medium leading-relaxed">{post.excerpt}</p>
                                <div className="flex items-center justify-between border-t border-border pt-6 mt-auto">
                                    <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="text-primary text-[10px] font-black uppercase tracking-widest group-hover:gap-2 flex items-center transition-all">
                                        Full Story &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                        <p className="text-muted-foreground font-bold text-xl uppercase tracking-widest">No journal entries found</p>
                    </div>
                )}
            </div>
        </div>
    );

}
