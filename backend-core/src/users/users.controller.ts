import { Body, Controller, Get, Inject, NotFoundException, Param, Post } from '@nestjs/common';
import { USER_REPOSITORY } from './repositories/user-repository.token';
import type { IUserRepository } from './repositories/user-repository.interface';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  @Post()
  async create(@Body() body: { email: string; password: string; name?: string }) { 
    return this.userRepository.create(body);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}