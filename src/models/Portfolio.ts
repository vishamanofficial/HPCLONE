import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  title: string;
  slug: string;
  clientName: string;
  category: string;
  description: string;
  challenge?: string;
  solution?: string;
  results?: string;
  metrics: Array<{ label: string; value: string }>;
  tags: string[];
  techStack: string[];
  images: string[];
  externalUrl?: string;
  testimonial?: {
    quote: string;
    author: string;
    designation: string;
  };
  highlightColor: string;
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

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    clientName: { type: String, required: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    challenge: { type: String, default: '' },
    solution: { type: String, default: '' },
    results: { type: String, default: '' },
    metrics: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    tags: [{ type: String }],
    techStack: [{ type: String }],
    images: [{ type: String }],
    externalUrl: { type: String, default: '' },
    testimonial: {
      quote: { type: String, default: '' },
      author: { type: String, default: '' },
      designation: { type: String, default: '' }
    },
    highlightColor: { type: String, default: 'from-blue-600 to-cyan-500' },
    status: { type: String, enum: ['draft', 'published'], default: 'published', index: true },
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

PortfolioSchema.index({ status: 1, displayOrder: 1 });

export const Portfolio = (mongoose.models.Portfolio as mongoose.Model<IPortfolio>) || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
