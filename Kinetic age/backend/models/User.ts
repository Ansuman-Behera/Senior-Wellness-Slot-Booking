import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  phone?: string;
  age?: number;
  emergencyContact?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String },
  age: { type: Number },
  emergencyContact: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
