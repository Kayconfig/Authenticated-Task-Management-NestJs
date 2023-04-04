import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './iam/auth/decorators/auth.decorator';
import { AUTH_TYPES } from './iam/auth/enum/auth.enum';

@Controller()
@Auth(AUTH_TYPES.None)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  welcome(): string {
    return this.appService.welcome();
  }
}
