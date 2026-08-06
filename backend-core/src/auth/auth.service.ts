import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '../users/repositories/user-repository.token';
import type { IUserRepository } from '../users/repositories/user-repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}