import mongoose, { Schema, Document } from 'mongoose';
import { calculatorQuestions, CalculatorQuestion } from '@/data/calculatorQuestions';

export interface ICalculatorSettings extends Document {
  currency: string;
  baseWeeks: number;
  questions: CalculatorQuestion[];
  updatedAt: Date;
}

const CalculatorOptionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    iconName: { type: String, required: true },
    baseCost: { type: Number },
    multiplier: { type: Number },
    flatCost: { type: Number },
  },
  { _id: false }
);

const CalculatorQuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    step: { type: Number, required: true },
    question: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['single', 'multi'], required: true },
    required: { type: Boolean, default: true },
    options: [CalculatorOptionSchema],
  },
  { _id: false }
);

const CalculatorSettingsSchema = new Schema<ICalculatorSettings>(
  {
    currency: { type: String, default: '$' },
    baseWeeks: { type: Number, default: 6 },
    questions: {
      type: [CalculatorQuestionSchema],
      default: () => calculatorQuestions,
    },
  },
  { timestamps: true }
);

export const CalculatorSettings =
  (mongoose.models.CalculatorSettings as mongoose.Model<ICalculatorSettings>) ||
  mongoose.model<ICalculatorSettings>('CalculatorSettings', CalculatorSettingsSchema);
