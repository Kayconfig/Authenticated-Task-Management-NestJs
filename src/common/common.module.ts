import { Module, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DataSerializationInterceptor } from './interceptors/data-serialization.interceptor';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
          forbidUnknownValues: true,
        }),
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: DataSerializationInterceptor,
    },
  ],
})
export class CommonModule {}
