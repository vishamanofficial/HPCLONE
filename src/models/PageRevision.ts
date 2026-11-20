import mongoose, { Schema, Document } from 'mongoose';

export interface IPageRevision extends Document {
  pageId: mongoose.Types.ObjectId;
  revisionNumber: number;
  title: string;
  slug: string;
  sectionsData: any[];
  seoData: any;
  status: string;
  changeSummary: string;
  changedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PageRevisionSchema = new Schema<IPageRevision>(
  {
    pageId: { type: Schema.Types.ObjectId, ref: 'Page', required: true, index: true },
    revisionNumber: { type: Number, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    sectionsData: { type: Schema.Types.Mixed, required: true },
    seoData: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, required: true },
    changeSummary: { type: String, default: 'Updated page content' },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PageRevisionSchema.index({ pageId: 1, revisionNumber: -1 });

export const PageRevision = (mongoose.models.PageRevision as mongoose.Model<IPageRevision>) || mongoose.model<IPageRevision>('PageRevision', PageRevisionSchema);
