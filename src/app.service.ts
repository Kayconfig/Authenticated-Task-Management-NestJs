import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  welcome(): string {
    return 'Welcome, please try /auth and /task paths. Documentation is loading...';
  }
}
