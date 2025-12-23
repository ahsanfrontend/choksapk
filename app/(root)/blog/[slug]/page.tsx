import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Facebook, Twitter } from 'lucide-react';
import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const path = `/blog/${slug}`;

    await dbConnect();
    const post = await BlogPost.findOne({ slug, status: 'published' });

    if (!post) return { title: 'Article Not Found' };

    return await getMetadataForPath(path, {
        title: `${post.title} | choksapk Journal`,
        description: post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 160),
    });
}

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const { slug } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post = await BlogPost.findOne({ slug: slug, status: 'published' }) as any;

    if (!post) notFound();

    return (
        <div className="bg-background min-h-screen py-16 md:py-24">
            <article className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12 text-center">
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {post.tags?.map((tag: string) => (
                            <span key={tag} className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full ring-1 ring-primary/20">{tag}</span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground mb-8 uppercase tracking-tight italic leading-tight">{post.title}</h1>
                    <div className="flex items-center justify-center gap-6 text-muted-foreground text-xs font-bold uppercase tracking-widest border-y border-border py-4">
                        <span>Published: {new Date(post.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span>5 min read</span>
                    </div>
                </div>

                {post.featuredImage && (
                    <div className="w-full h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden mb-16 shadow-2xl ring-1 ring-border">
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="max-w-3xl mx-auto">
                    <div className="text-foreground text-lg md:text-xl leading-relaxed font-medium whitespace-pre-wrap selection:bg-primary selection:text-primary-foreground first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                        {post.content}
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="text-center sm:text-left">
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-2">Share this story</p>
                        <div className="flex gap-4">
                            <button className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all"><Facebook size={18} /></button>
                            <button className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all"><Twitter size={18} /></button>
                        </div>
                    </div>
                    <Link href="/blog" className="px-10 py-4 bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-foreground/10 active:scale-95">
                        Back to Journal
                    </Link>
                </div>
            </article>
        </div>
    );

}
