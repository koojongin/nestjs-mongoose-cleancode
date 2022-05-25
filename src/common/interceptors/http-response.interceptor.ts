import { CallHandler, ExecutionContext, Inject, Injectable, LoggerService, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}
  /**
   * Response에 포맷을 적용
   * @param context
   * @param next
   */
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { url, method, header } = request;
    const {
      context: { config },
    } = request;
    const response = (data) => data;
    this.logger.log(`${method} ${url}`);
    return next.handle().pipe(map(response));
  }
}
