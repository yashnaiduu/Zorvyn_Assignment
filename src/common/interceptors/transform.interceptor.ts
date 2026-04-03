import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: Record<string, unknown>) => {
        const isPaginated =
          data && typeof data === 'object' && 'data' in data && 'meta' in data;

        const payload = isPaginated
          ? data.data
          : data?.data !== undefined
            ? data.data
            : data;

        const meta = isPaginated ? (data.meta as PaginationMeta) : undefined;
        const message =
          data && typeof data.message === 'string' ? data.message : undefined;

        return {
          success: true,
          data: payload as T,
          ...(meta && { meta }),
          ...(message && { message }),
        };
      }),
    );
  }
}
