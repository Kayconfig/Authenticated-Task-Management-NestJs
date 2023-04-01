import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { compare, genSaltSync, hash } from 'bcrypt';

@Injectable()
export class BcryptService extends HashingService {
  async hash(data: string): Promise<string> {
    return hash(data, genSaltSync());
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return compare(data, hash);
  }
}
