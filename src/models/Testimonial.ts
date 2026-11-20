import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  designation: string;
  company: string;
  avatarUrl?: string;
  content: string;
  rating: number;
  projectRef?: mongoose.Types.ObjectId;
  isFeatured: boolean;
  displayOrder: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    designation: { type: String, required: true },
    company: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    content: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    projectRef: { type: Schema.Types.ObjectId, ref: 'Portfolio' },
    isFeatured: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'published' }
  },
  { timestamps: true }
);

export const Testimonial = (mongoose.models.Testimonial as mongoose.Model<ITestimonial>) || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
