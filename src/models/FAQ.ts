import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  relatedServiceSlug?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'general', index: true },
    relatedServiceSlug: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const FAQ = (mongoose.models.FAQ as mongoose.Model<IFAQ>) || mongoose.model<IFAQ>('FAQ', FAQSchema);
