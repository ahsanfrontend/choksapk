import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
    siteName: string;
    logoUrl: string;
    faviconUrl: string;
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
    };
    homeBanners: string[];
    createdAt: Date;
    updatedAt: Date;
}

const SiteSettingsSchema: Schema<ISiteSettings> = new Schema(
    {
        siteName: { type: String, default: 'choksapk' },
        logoUrl: { type: String },
        faviconUrl: { type: String },
        socialLinks: {
            facebook: String,
            twitter: String,
            instagram: String,
        },
        homeBanners: [{ type: String }],
    },
    { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
export default SiteSettings;
