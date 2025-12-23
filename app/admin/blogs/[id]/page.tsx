import BlogForm from '@/components/admin/BlogForm';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;
    const post = await BlogPost.findById(id);

    if (!post) return <div>Post not found</div>;

    const postObj = JSON.parse(JSON.stringify(post));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Editorial <span className="text-primary italic">Revision</span></h1>
                <p className="text-muted-foreground text-sm font-medium mt-1">Modifying narrative parameters for: {post.title}</p>
            </div>
            <BlogForm initialData={postObj} />
        </div>
    );
}
