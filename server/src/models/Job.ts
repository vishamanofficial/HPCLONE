import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  department: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    location: { type: String, default: 'Noida Office / Remote' },
    experience: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    department: { type: String, default: 'Engineering' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Job = mongoose.model<IJob>('Job', JobSchema);
