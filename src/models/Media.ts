import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  publicId?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  altText: string;
  caption?: string;
  folder: string;
  usageCount: number;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    dimensions: {
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 }
    },
    altText: { type: String, default: '' },
    caption: { type: String, default: '' },
    folder: { type: String, default: 'general', index: true },
    usageCount: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

MediaSchema.index({ createdAt: -1 });

export const Media = (mongoose.models.Media as mongoose.Model<IMedia>) || mongoose.model<IMedia>('Media', MediaSchema);
