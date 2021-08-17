import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RedisPropagatorService } from './redis-propagator.service';

@Injectable()
export class RedisPropagatorGatewayInterceptor<T> implements NestInterceptor<T, WsResponse<T>> {
  public constructor(private readonly redisPropagatorService: RedisPropagatorService) { }

  public intercept(context: ExecutionContext, next: CallHandler): Observable<WsResponse<T>> {
    return next.handle().pipe(
      tap((response) => {
        if(response){
          response.forEach(data => {
            this.redisPropagatorService.emitToAllSocketForUser({
              ...data,
              socketId: null,
              userId: data.sender
            });
          });   
        }
      }),
    );
  }
}
