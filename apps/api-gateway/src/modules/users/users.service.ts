import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async updateProfile(id: string, data: Partial<User>) {
    await this.usersRepository.update(id, data);
    return this.findById(id);
  }

  async getPublicProfile(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'full_name', 'avatar_url', 'bio', 'created_at'],
    });
    return user;
  }
}
