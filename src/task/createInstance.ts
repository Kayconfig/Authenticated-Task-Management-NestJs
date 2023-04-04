export function createInstance<ClassType, DataType>(
  Class: new (data: DataType) => ClassType,
  data: DataType,
) {
  return new Class(data);
}
