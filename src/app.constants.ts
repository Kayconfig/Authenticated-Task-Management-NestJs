import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
export const TYPEORM_ROOT_OPTIONS: TypeOrmModuleAsyncOptions = {
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_HOST') || 'localhost',
    port: +config.get('DB_PORT') || 5432,
    username: config.getOrThrow('DB_USERNAME'),
    password: config.getOrThrow('DB_PASSWORD'),
    database: config.getOrThrow('DB_NAME'),
    autoLoadEntities: true,
    synchronize: config.get('NODE_ENV') === 'development',
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
};

export const POSTGRES_DUPLICATE_ERR_CODE = '23505';
