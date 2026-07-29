import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceDocument extends Document {
  title: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
  category: string;
  iconName?: string;
}

const ServiceSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
  category: { type: String, default: 'Wellness' },
  iconName: { type: String, default: 'Activity' },
});

export const ServiceModel = mongoose.models.Service || mongoose.model<IServiceDocument>('Service', ServiceSchema);
