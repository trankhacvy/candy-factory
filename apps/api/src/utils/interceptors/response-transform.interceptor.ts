import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseResponse } from '../types/base-response.type';

const excludePaths = ['/api/v1/auth/wallet/login'];

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, BaseResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponse<T>> {
    const req = context.switchToHttp().getRequest();

    if (excludePaths.includes(req.url)) return next.handle();
    console.log('check');
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        const message = data.message;

        return { data, statusCode, message };
      }),

      catchError((err) =>
        of({
          statusCode: err?.response?.statusCode ?? 500,
          error: err?.message ?? 'Unknown error',
        }),
      ),
    );
  }
}
