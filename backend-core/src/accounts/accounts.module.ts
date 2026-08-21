import { Module } from '@nestjs/common';
import { ACCOUNT_REPOSITORY } from './repositories/account-repository.token';
import { PostgresAccountRepository } from './repositories/postgres-account.repository';
import { MongoAccountRepository } from './repositories/mongo-account.repository';
import { AccountsController } from './accounts.controller';

@Module({
  controllers: [AccountsController],
  providers: [
    {
      provide: ACCOUNT_REPOSITORY,
      useClass:
        process.env.DB_DRIVER === 'mongo'
          ? MongoAccountRepository
          : PostgresAccountRepository,
    },
  ],
  exports: [ACCOUNT_REPOSITORY],
})
export class AccountsModule {}