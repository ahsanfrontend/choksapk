import mongoose from 'mongoose';

const PageMetadataSchema = new mongoose.Schema({
    routePath: {
        type: String, // e.g., "/", "/games/slots", "/blog"
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    keywords: {
        type: String,
        required: false,
    },
    ogImage: {
        type: String,
        required: false,
    },
}, { timestamps: true });

export default mongoose.models.PageMetadata || mongoose.model('PageMetadata', PageMetadataSchema);
