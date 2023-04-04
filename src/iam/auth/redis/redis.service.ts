import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Redis } from 'ioredis';
import { ActiveUserDto } from 'src/common/dtos/active-user.dto';
import { iamConfig } from 'src/iam/config/iam.config';

@Injectable()
export class RedisService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  redisClient: Redis;
  constructor(
    @Inject(iamConfig.KEY)
    private readonly config: ConfigType<typeof iamConfig>,
  ) {}
  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: this.config.redisHost,
      port: this.config.redisPort,
    });
  }
  onApplicationShutdown() {
    this.redisClient.shutdown();
  }

  async setTokenId(user: ActiveUserDto, tokenId: string) {
    const key = this.getKey(user);
    await this.redisClient.set(key, tokenId);
  }

  async invalidateTokenId(user: ActiveUserDto) {
    const key = this.getKey(user);
    await this.redisClient.del(key);
  }

  async validateTokenId(user: ActiveUserDto, tokenId: string) {
    const key = this.getKey(user);
    const savedTokenId = await this.redisClient.get(key);
    if (savedTokenId !== tokenId || !savedTokenId) {
      console.error('tokenId validation exception');
      throw new UnauthorizedException();
    }
    return true;
  }
  getKey(user: ActiveUserDto) {
    return user.email + user.id;
  }
}
