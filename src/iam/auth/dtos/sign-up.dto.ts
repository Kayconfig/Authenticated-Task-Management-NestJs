import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;
}
