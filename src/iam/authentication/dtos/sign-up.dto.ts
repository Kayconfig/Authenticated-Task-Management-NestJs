import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;
}
