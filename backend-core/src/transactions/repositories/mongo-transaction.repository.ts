import { TransactionModel } from '../../database/mongo/schemas/transaction.schema';
import { ITransactionRepository, Transaction } from './transaction-repository.interface';

export class MongoTransactionRepository implements ITransactionRepository {
  async findById(id: string): Promise<Transaction | null> {
    const doc = await TransactionModel.findById(id);
    if (!doc) return null;
    return this.toTransaction(doc);
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const docs = await TransactionModel.find({ accountId });
    return docs.map((doc) => this.toTransaction(doc));
  }

  async create(data: { accountId: string; amount: number; type: string; description?: string }): Promise<Transaction> {
    const doc = await TransactionModel.create(data);
    return this.toTransaction(doc);
  }

  private toTransaction(doc: any): Transaction {
    return {
      id: doc._id.toString(),
      accountId: doc.accountId,
      amount: doc.amount,
      type: doc.type,
      description: doc.description,
      createdAt: doc.createdAt,
    };
  }
}