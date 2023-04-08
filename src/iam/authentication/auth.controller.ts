import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AUTH_TYPES } from './enum/auth.enum';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
@ApiTags('/auth')
@Auth(AUTH_TYPES.None)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
}
