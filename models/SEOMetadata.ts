import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISEOMetadata extends Document {
    route: string;
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SEOMetadataSchema: Schema<ISEOMetadata> = new Schema(
    {
        route: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        keywords: { type: String },
        ogImage: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const SEOMetadata: Model<ISEOMetadata> = mongoose.models.SEOMetadata || mongoose.model<ISEOMetadata>('SEOMetadata', SEOMetadataSchema);
export default SEOMetadata;
