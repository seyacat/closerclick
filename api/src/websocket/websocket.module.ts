import { Module } from '@nestjs/common';
import { WebSocketGatewayHandler } from './websocket.gateway';
import { ConnectionManagerService } from './connection-manager.service';

@Module({
  providers: [WebSocketGatewayHandler, ConnectionManagerService],
  exports: [ConnectionManagerService],
})
export class WebSocketModule {}

