import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ITransactionRepository, Transaction } from './transaction-repository.interface';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export class PostgresTransactionRepository implements ITransactionRepository {
  async findById(id: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({ where: { id } });
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    return prisma.transaction.findMany({ where: { accountId } });
  }

  async create(data: { accountId: string; amount: number; type: string; description?: string }): Promise<Transaction> {
    return prisma.transaction.create({ data });
  }
}