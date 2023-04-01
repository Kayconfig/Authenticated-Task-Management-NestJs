import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ActiveUserDto } from '../dtos/active-user.dto';

export const ActiveUser = createParamDecorator(
  (data: keyof ActiveUserDto, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    return data ? user?.[data] : user;
  },
);
