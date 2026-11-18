import mongoose, { Schema, Document } from 'mongoose';

export interface IPageSection {
  id: string;
  type: string;
  name?: string;
  order: number;
  isEnabled: boolean;
  settings?: Record<string, any>;
  content: Record<string, any>;
}

export interface IPageSEO {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  robots?: string;
  schemaType?: string;
  customSchemaJson?: string;
}

export interface IPage extends Document {
  title: string;
  slug: string;
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'scheduled' | 'archived';
  publishedAt?: Date;
  scheduledAt?: Date;
  sections: IPageSection[];
  seo: IPageSEO;
  currentRevision: number;
  author?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PageSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String },
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
    settings: { type: Schema.Types.Mixed, default: {} },
    content: { type: Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const PageSEOSchema = new Schema(
  {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    focusKeyword: { type: String, default: '' },
    secondaryKeywords: [{ type: String }],
    ogTitle: { type: String, default: '' },
    ogDescription: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    twitterCard: { type: String, default: 'summary_large_image' },
    robots: { type: String, default: 'index, follow' },
    schemaType: { type: String, default: 'WebPage' },
    customSchemaJson: { type: String, default: '' }
  },
  { _id: false }
);

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'approved', 'published', 'scheduled', 'archived'],
      default: 'draft'
    },
    publishedAt: { type: Date },
    scheduledAt: { type: Date },
    sections: [PageSectionSchema],
    seo: { type: PageSEOSchema, default: () => ({}) },
    currentRevision: { type: Number, default: 1 },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

PageSchema.index({ status: 1 });

export const Page = mongoose.model<IPage>('Page', PageSchema);
