import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  password: string;
}
