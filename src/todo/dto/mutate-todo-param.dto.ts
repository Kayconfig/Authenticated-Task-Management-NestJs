import { IsString, IsUUID } from 'class-validator';

export class MutateTodoParamDto {
  @IsUUID('all', { message: 'id in param must be valid UUID' })
  @IsString()
  id: string;
}
