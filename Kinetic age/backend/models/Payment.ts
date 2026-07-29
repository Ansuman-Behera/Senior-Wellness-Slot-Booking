import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentDocument extends Document {
  booking: mongoose.Types.ObjectId | string;
  amount: number;
  paymentMethod: 'Prepaid' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  transactionRef: string;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Prepaid', 'Cash on Delivery'], required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Refunded', 'Failed'], required: true },
  transactionRef: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PaymentModel = mongoose.models.Payment || mongoose.model<IPaymentDocument>('Payment', PaymentSchema);
