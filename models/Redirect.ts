import mongoose from 'mongoose';

const RedirectSchema = new mongoose.Schema({
    sourcePath: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    destinationPath: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        enum: [301, 302],
        default: 301
    },
    clicks: {
        type: Number,
        default: 0
    },
    lastAccessed: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.models.Redirect || mongoose.model('Redirect', RedirectSchema);
