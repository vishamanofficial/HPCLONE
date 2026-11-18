import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadNote {
  id: string;
  text: string;
  addedBy?: string;
  createdAt: Date;
}

export interface ILeadActivity {
  action: string;
  performedBy?: string;
  timestamp: Date;
  details?: string;
}

export interface ILead extends Document {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  isWhatsApp: boolean;
  companyName?: string;
  interestedService?: string;
  budget?: string;
  message?: string;
  source: 'homepage_blueprint' | 'contact_page' | 'cost_calculator' | 'landing_page' | 'custom_form';
  calculatorDetails?: {
    platform?: string;
    category?: string;
    design?: string;
    management?: string[];
    estimatedCost?: number;
    timelineWeeks?: { min: number; max: number };
    suggestedTech?: string[];
  };
  status:
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'proposal_sent'
    | 'negotiation'
    | 'converted'
    | 'lost'
    | 'spam';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: mongoose.Types.ObjectId;
  notes: ILeadNote[];
  activityLog: ILeadActivity[];
  followUpDate?: Date;
  followUpCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LeadNoteSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    addedBy: { type: String, default: 'Admin' },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const LeadActivitySchema = new Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: String, default: 'System' },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, default: '' }
  },
  { _id: false }
);

const LeadSchema = new Schema<ILead>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    countryCode: { type: String, default: '+91' },
    isWhatsApp: { type: Boolean, default: true },
    companyName: { type: String, default: '' },
    interestedService: { type: String, default: 'Custom Software' },
    budget: { type: String, default: '$5k - $15k' },
    message: { type: String, default: '' },
    source: {
      type: String,
      enum: ['homepage_blueprint', 'contact_page', 'cost_calculator', 'landing_page', 'custom_form'],
      default: 'contact_page'
    },
    calculatorDetails: {
      platform: { type: String },
      category: { type: String },
      design: { type: String },
      management: [{ type: String }],
      estimatedCost: { type: Number },
      timelineWeeks: {
        min: { type: Number },
        max: { type: Number }
      },
      suggestedTech: [{ type: String }]
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'converted', 'lost', 'spam'],
      default: 'new',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: [LeadNoteSchema],
    activityLog: [LeadActivitySchema],
    followUpDate: { type: Date },
    followUpCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ followUpDate: 1 });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
