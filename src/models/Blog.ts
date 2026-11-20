import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatarUrl: string;
    role: string;
    bio?: string;
  };
  featuredImage?: string;
  imageAlt?: string;
  readTime: string;
  publishedAt?: Date;
  scheduledAt?: Date;
  status: 'draft' | 'pending_review' | 'published' | 'scheduled' | 'archived';
  tableOfContents?: Array<{ id: string; title: string; level: number }>;
  viewsCount?: number;
  relatedArticles?: mongoose.Types.ObjectId[];
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

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, index: true },
    tags: [{ type: String, index: true }],
    author: {
      name: { type: String, required: true },
      avatarUrl: { type: String, default: '' },
      role: { type: String, default: '' },
      bio: { type: String, default: '' }
    },
    featuredImage: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    readTime: { type: String, default: '5 min read' },
    viewsCount: { type: Number, default: 0 },
    publishedAt: { type: Date },
    scheduledAt: { type: Date },
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'published', 'scheduled', 'archived'],
      default: 'draft',
      index: true
    },
    tableOfContents: [
      {
        id: { type: String },
        title: { type: String },
        level: { type: Number, default: 2 }
      }
    ],
    relatedArticles: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
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

BlogSchema.index({ status: 1, publishedAt: -1 });

export const Blog = (mongoose.models.Blog as mongoose.Model<IBlog>) || mongoose.model<IBlog>('Blog', BlogSchema);
