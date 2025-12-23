import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema({
    eventType: {
        type: String,
        enum: ['click', 'visit', '404'],
        required: true
    },
    path: {
        type: String,
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    entityType: {
        type: String,
        enum: ['game', 'blog', 'page'],
        required: true
    },
    ip: {
        type: String,
        required: false
    },
    userAgent: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Index for better query performance on stats
AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });

export default mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
