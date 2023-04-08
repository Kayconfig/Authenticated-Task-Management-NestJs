import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(data: string): Promise<string>;

  abstract compare(data: string, hash: string): Promise<boolean>;
}
