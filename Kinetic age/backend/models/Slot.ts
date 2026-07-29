import mongoose, { Schema, Document } from 'mongoose';

export interface ISlotDocument extends Document {
  service: mongoose.Types.ObjectId | string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  status: 'available' | 'booked' | 'disabled';
}

const SlotSchema: Schema = new Schema({
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  capacity: { type: Number, required: true, default: 3 },
  bookedSeats: { type: Number, required: true, default: 0 },
  availableSeats: { type: Number, required: true, default: 3 },
  status: { type: String, enum: ['available', 'booked', 'disabled'], default: 'available' },
});

export const SlotModel = mongoose.models.Slot || mongoose.model<ISlotDocument>('Slot', SlotSchema);
