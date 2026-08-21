import { AccountModel } from '../../database/mongo/schemas/account.schema';
import { IAccountRepository, Account } from './account-repository.interface';

export class MongoAccountRepository implements IAccountRepository {
  async findById(id: string): Promise<Account | null> {
    const doc = await AccountModel.findById(id);
    if (!doc) return null;
    return this.toAccount(doc);
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const docs = await AccountModel.find({ userId });
    return docs.map((doc) => this.toAccount(doc));
  }

  async create(data: { userId: string; accountName: string; currency?: string }): Promise<Account> {
    const doc = await AccountModel.create(data);
    return this.toAccount(doc);
  }

  async updateBalance(id: string, newBalance: number): Promise<Account> {
    const doc = await AccountModel.findByIdAndUpdate(id, { balance: newBalance }, { new: true });
    if (!doc) throw new Error('Account not found');
    return this.toAccount(doc);
  }

  private toAccount(doc: any): Account {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      accountName: doc.accountName,
      balance: doc.balance,
      currency: doc.currency,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}