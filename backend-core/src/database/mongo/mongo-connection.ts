import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGO_URL ?? 'mongodb://localhost:27017/financeapp';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}