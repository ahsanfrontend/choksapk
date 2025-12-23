import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: mongoose.Types.ObjectId;
    tags: string[];
    status: 'draft' | 'published';
    seoTitle?: string;
    seoDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema<IBlogPost> = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        excerpt: { type: String },
        featuredImage: { type: String },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        tags: [{ type: String }],
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },
        seoTitle: { type: String },
        seoDescription: { type: String },
    },
    { timestamps: true }
);

const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
export default BlogPost;
