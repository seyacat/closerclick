import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketModule } from './websocket/websocket.module';
import { ProxyModule } from './proxy/proxy.module';
import { GitModule } from './git/git.module';

@Module({
  imports: [WebSocketModule, ProxyModule, GitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
