import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { IAccountRepository, Account } from './account-repository.interface';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export class PostgresAccountRepository implements IAccountRepository {
  async findById(id: string): Promise<Account | null> {
    return prisma.account.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return prisma.account.findMany({ where: { userId } });
  }

  async create(data: { userId: string; accountName: string; currency?: string }): Promise<Account> {
    return prisma.account.create({ data });
  }

  async updateBalance(id: string, newBalance: number): Promise<Account> {
    return prisma.account.update({ where: { id }, data: { balance: newBalance } });
  }
}