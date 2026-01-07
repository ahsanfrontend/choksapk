import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'super_admin' | 'admin' | 'user';
    status: 'active' | 'blocked';
    verificationCode?: string;
    verificationCodeExpires?: Date;
    pendingEmail?: string;
    pendingName?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        role: { type: String, enum: ['super_admin', 'admin', 'user'], default: 'user' },
        status: { type: String, enum: ['active', 'blocked'], default: 'active' },
        verificationCode: { type: String, required: false },
        verificationCodeExpires: { type: Date, required: false },
        pendingEmail: { type: String, required: false },
        pendingName: { type: String, required: false },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
