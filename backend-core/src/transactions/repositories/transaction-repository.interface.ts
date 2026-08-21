export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: string;
  description?: string | null;
  createdAt: Date;
}

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  create(data: { accountId: string; amount: number; type: string; description?: string }): Promise<Transaction>;
}