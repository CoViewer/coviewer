import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseRoot } from './response.dto';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ResponseRoot<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseRoot<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        msg: null,
        data,
      })),
    );
  }
}
