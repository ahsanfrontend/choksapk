import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
    // Branding
    siteName: string;
    siteTagline: string;
    logoUrl: string;
    logoDarkUrl?: string;
    faviconUrl: string;
    ogImageUrl?: string;

    // SEO & Meta
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];

    // Contact Information
    contactEmail?: string;
    supportEmail?: string;
    contactPhone?: string;
    address?: string;

    // Social Links
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
        linkedin?: string;
        telegram?: string;
        discord?: string;
        whatsapp?: string;
    };

    // Site Theme & Colors
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;

    // Banners & Media
    homeBanners: string[];

    // API Keys
    openaiKey?: string;
    geminiKey?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;

    // Legal & Pages
    termsUrl?: string;
    privacyUrl?: string;
    aboutUrl?: string;

    // Features
    maintenanceMode: boolean;
    maintenanceMessage?: string;
    registrationEnabled: boolean;
    commentsEnabled: boolean;

    // Footer
    footerText?: string;
    copyrightText?: string;

    createdAt: Date;
    updatedAt: Date;
}

const SiteSettingsSchema: Schema<ISiteSettings> = new Schema(
    {
        // Branding
        siteName: { type: String, default: 'choksapk' },
        siteTagline: { type: String, default: 'Premium Asset Distribution Protocol' },
        logoUrl: { type: String },
        logoDarkUrl: { type: String },
        faviconUrl: { type: String },
        ogImageUrl: { type: String },

        // SEO & Meta
        metaTitle: { type: String },
        metaDescription: { type: String },
        metaKeywords: [{ type: String }],

        // Contact Information
        contactEmail: { type: String },
        supportEmail: { type: String },
        contactPhone: { type: String },
        address: { type: String },

        // Social Links
        socialLinks: {
            facebook: String,
            twitter: String,
            instagram: String,
            youtube: String,
            linkedin: String,
            telegram: String,
            discord: String,
            whatsapp: String,
        },

        // Site Theme & Colors
        primaryColor: { type: String, default: '#DDA430' },
        secondaryColor: { type: String, default: '#101010' },
        accentColor: { type: String, default: '#E75153' },

        // Banners & Media
        homeBanners: [{ type: String }],

        // API Keys
        openaiKey: { type: String },
        geminiKey: { type: String },
        googleAnalyticsId: { type: String },
        facebookPixelId: { type: String },

        // Legal & Pages
        termsUrl: { type: String },
        privacyUrl: { type: String },
        aboutUrl: { type: String },

        // Features
        maintenanceMode: { type: Boolean, default: false },
        maintenanceMessage: { type: String },
        registrationEnabled: { type: Boolean, default: true },
        commentsEnabled: { type: Boolean, default: true },

        // Footer
        footerText: { type: String },
        copyrightText: { type: String },
    },
    { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
export default SiteSettings;
