import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { StatsController } from './stats.controller';
import { DebugController } from './debug.controller';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebSocketModule],
  controllers: [ProxyController, StatsController, DebugController],
  providers: [ProxyService],
})
export class ProxyModule {}

