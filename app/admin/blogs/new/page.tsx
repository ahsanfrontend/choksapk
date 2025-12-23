import BlogForm from '@/components/admin/BlogForm';

export default function NewBlogPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Editorial <span className="text-primary italic">Inception</span></h1>
                <p className="text-muted-foreground text-sm font-medium mt-1">Initialize a new narrative for the choksapk Journal.</p>
            </div>
            <BlogForm />
        </div>
    );
}
