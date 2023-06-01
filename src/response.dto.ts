export class ResponseRoot<T> {
  code: number;
  msg: string | null;
  data: T;
}
