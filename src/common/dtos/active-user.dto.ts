import { IsString } from 'class-validator';

export class ActiveUserDto {
  @IsString()
  id: string;
  @IsString()
  email: string;
}
