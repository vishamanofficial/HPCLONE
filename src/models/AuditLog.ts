import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    userRole: { type: String, default: 'Admin' },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String, default: '' },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = (mongoose.models.AuditLog as mongoose.Model<IAuditLog>) || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
