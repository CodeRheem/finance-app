import { Schema, model, Document } from 'mongoose';

export interface AccountDocument extends Document {
  userId: string;
  accountName: string;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<AccountDocument>(
  {
    userId: { type: String, required: true },
    accountName: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'NGN' },
  },
  { timestamps: true },
);

export const AccountModel = model<AccountDocument>('Account', AccountSchema);