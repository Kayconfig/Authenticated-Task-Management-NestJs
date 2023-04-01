import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepo.create(createUserDto);
      return this.userRepo.save(user);
    } catch (err) {
      if (err instanceof TypeORMError) {
        throw new BadRequestException('email already in use.');
      }
      throw err;
    }
  }

  async findOneById(id: string) {
    try {
      const user = await this.userRepo.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('user not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepo.findOneBy({ email });
      if (!user) {
        throw new NotFoundException('user not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateById(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOneById(id);
      Object.assign(user, updateUserDto);
      return this.userRepo.save(user);
    } catch (err) {
      throw err;
    }
  }

  private async remove(id: string) {
    return this.userRepo.delete(id);
  }
}
