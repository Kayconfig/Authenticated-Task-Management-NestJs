import { SignUpResponseDto } from 'src/iam/auth/dtos/sign-up-response.dto';

export function createInstance<ClassType, DataType>(
  Class: new (data: DataType) => ClassType,
  data: DataType,
) {
  return new Class(data);
}
