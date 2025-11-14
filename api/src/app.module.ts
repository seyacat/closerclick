import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketModule } from './websocket/websocket.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [WebSocketModule, ProxyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
