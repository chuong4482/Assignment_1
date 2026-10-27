import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * [2.3] Đo & tối ưu thời gian phản hồi (< 500ms)
 * Gắn header X-Response-Time cho mọi request và cảnh báo nếu vượt ngưỡng 500ms.
 */
@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseTimeInterceptor.name);
  private readonly thresholdMs = 500;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = performance.now();
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    if (response && typeof response.on === 'function') {
      response.on('finish', () => {
        const elapsedMs = Number((performance.now() - start).toFixed(2));
        if (elapsedMs > this.thresholdMs) {
          this.logger.warn(
            `Slow API [${request?.method} ${request?.url}]: ${elapsedMs}ms (> ${this.thresholdMs}ms)`,
          );
        }
      });
    }

    return next.handle().pipe(
      tap(() => {
        const elapsedMs = Number((performance.now() - start).toFixed(2));
        if (response && !response.headersSent && typeof response.setHeader === 'function') {
          response.setHeader('X-Response-Time', `${elapsedMs}ms`);
        }
      }),
    );
  }
}
