import mongoose, { Schema, Document } from 'mongoose';

export interface IBookingDocument extends Document {
  bookingId: string;
  user: mongoose.Types.ObjectId | string;
  service: mongoose.Types.ObjectId | string;
  slot: mongoose.Types.ObjectId | string;
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  paymentType: 'Prepaid' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  bookingId: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  slot: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
  bookingStatus: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  paymentType: { type: String, enum: ['Prepaid', 'Cash on Delivery'], required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Refunded', 'Failed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

export const BookingModel = mongoose.models.Booking || mongoose.model<IBookingDocument>('Booking', BookingSchema);
