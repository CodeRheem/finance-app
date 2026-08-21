import { Module } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from './repositories/transaction-repository.token';
import { PostgresTransactionRepository } from './repositories/postgres-transaction.repository';
import { MongoTransactionRepository } from './repositories/mongo-transaction.repository';
import { TransactionsController } from './transactions.controller';
@Module({
  controllers: [TransactionsController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass:
        process.env.DB_DRIVER === 'mongo'
          ? MongoTransactionRepository
          : PostgresTransactionRepository,
    },
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionsModule {}