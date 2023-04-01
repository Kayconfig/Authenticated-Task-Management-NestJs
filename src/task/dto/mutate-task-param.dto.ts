import { IsString, IsUUID } from 'class-validator';

export class MutateTaskParamDto {
  @IsUUID('all', { message: 'id in param must be valid UUID' })
  @IsString()
  id: string;
}
