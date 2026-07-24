import { Schema, model, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: false },
  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>('User', UserSchema);