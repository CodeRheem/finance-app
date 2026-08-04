import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './repositories/user-repository.token';
import { PostgresUserRepository } from './repositories/postgres-user.repository';
import { MongoUserRepository } from './repositories/mongo-user.repository';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass:
        process.env.DB_DRIVER === 'mongo'
          ? MongoUserRepository
          : PostgresUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}