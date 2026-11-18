import mongoose, { Schema, Document } from 'mongoose';

export interface IRedirect extends Document {
  sourceUrl: string;
  destinationUrl: string;
  statusCode: 301 | 302;
  isActive: boolean;
  hitCount: number;
  lastTriggeredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RedirectSchema = new Schema<IRedirect>(
  {
    sourceUrl: { type: String, required: true, unique: true, trim: true },
    destinationUrl: { type: String, required: true, trim: true },
    statusCode: { type: Number, enum: [301, 302], default: 301 },
    isActive: { type: Boolean, default: true },
    hitCount: { type: Number, default: 0 },
    lastTriggeredAt: { type: Date },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

RedirectSchema.index({ sourceUrl: 1 });

export const Redirect = mongoose.model<IRedirect>('Redirect', RedirectSchema);
