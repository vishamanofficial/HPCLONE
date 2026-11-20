import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  featuredImage?: string;
  gallery: string[];
  benefits: string[];
  features: string[];
  techStack: string[];
  processPhases: Array<{ title: string; duration: string; desc: string }>;
  faqs: Array<{ title: string; content: string }>;
  pricing?: { startingPrice?: number; currency?: string; note?: string };
  status: 'draft' | 'published';
  displayOrder: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    focusKeyword?: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDesc: { type: String, required: true },
    longDesc: { type: String, required: true },
    iconName: { type: String, default: 'Code' },
    featuredImage: { type: String, default: '' },
    gallery: [{ type: String }],
    benefits: [{ type: String }],
    features: [{ type: String }],
    techStack: [{ type: String }],
    processPhases: [
      {
        title: { type: String },
        duration: { type: String },
        desc: { type: String }
      }
    ],
    faqs: [
      {
        title: { type: String },
        content: { type: String }
      }
    ],
    pricing: {
      startingPrice: { type: Number },
      currency: { type: String, default: 'USD' },
      note: { type: String }
    },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    displayOrder: { type: Number, default: 0 },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      canonicalUrl: { type: String, default: '' },
      focusKeyword: { type: String, default: '' },
      ogImage: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

ServiceSchema.index({ status: 1, displayOrder: 1 });

export const Service = (mongoose.models.Service as mongoose.Model<IService>) || mongoose.model<IService>('Service', ServiceSchema);
