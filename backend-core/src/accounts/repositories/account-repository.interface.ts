export interface Account {
  id: string;
  userId: string;
  accountName: string;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  create(data: { userId: string; accountName: string; currency?: string }): Promise<Account>;
  updateBalance(id: string, newBalance: number): Promise<Account>;
}