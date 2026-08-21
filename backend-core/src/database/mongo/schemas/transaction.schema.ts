import { Schema, model, Document } from 'mongoose';

export interface TransactionDocument extends Document {
  accountId: string;
  amount: number;
  type: string;
  description?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<TransactionDocument>(
  {
    accountId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String, required: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const TransactionModel = model<TransactionDocument>('Transaction', TransactionSchema);