import { UserModel } from '../../database/mongo/schemas/user.schema';
import { IUserRepository, User } from './user-repository.interface';

export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(data: { email: string; name?: string }): Promise<User> {
    const doc = await UserModel.create(data);
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}