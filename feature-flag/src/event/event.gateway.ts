import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseInterceptors } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { RedisPropagatorGatewayInterceptor } from '../shared/redis-propagator/redis-propagator-gatewat.interceptor';
import { RedisPropagatorService } from '../shared/redis-propagator/redis-propagator.service';
import { SocketStateService } from '../shared/socket-state/socket-state.service';
import { FeaturesService } from '../features/features.service';
import { EventsEnum } from './enums/events.enums';

@UseInterceptors(RedisPropagatorGatewayInterceptor)
@WebSocketGateway({
  namespace: '/realtime',
  cors: { origin: '*' }
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  constructor(
    private readonly service: FeaturesService,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
  ) { }

  private logger: Logger = new Logger('MessageGateway');

  @SubscribeMessage('getStatus')
  public async getAllStatus(client: Socket, host: string) {
    
    const data = await this.service.getAllStatusForHost(host);
    return [
      { event: EventsEnum.EVENTTOFRONTEND, data, sender: 'front' }
    ];
  };

  @SubscribeMessage('joinRoom')
  public async joinRoom(client: Socket, uuid: string) {
    
    client.join('front');
    
    this.socketStateService.add('front', client);
    
    client.emit('joinedRoom', 'front');
    this.logger.log(`Client JOIN: ${client.id} - room 'front'`);
  };

  @SubscribeMessage('leaveRoom')
  public async leaveRoom(client: Socket, uuid: string): Promise<void> {
    
    client.leave('front');
    
    this.socketStateService.remove('front', client);
    
    client.emit('leftRoomServer', 'front');
    this.logger.log(`Client LEAVE: ${client.id} - room 'front'`);
  }

  public afterInit(server: Server): void {
    this.redisPropagatorService.injectSocketServer(server);
  }

  public async handleDisconnect(client: Socket): Promise<void> {
    this.socketStateService.remove('front', client);
    client.removeAllListeners('disconnect');
    return this.logger.log(`Client disconnected: ${client.id} - 'front'`);
  }

  public async handleConnection(client: Socket): Promise<void> {
    this.socketStateService.add('front', client);
    return this.logger.log(`Client connected: ${client.id} - 'front'`);
  }
}
