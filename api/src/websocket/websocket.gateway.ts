import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConnectionManagerService } from './connection-manager.service';
import type { WebSocketMessage, HttpResponse } from '../types/websocket.types';

/**
 * Gateway WebSocket para manejar conexiones de clientes
 */
@WebSocketGateway({
  cors: {
    origin: '*', // En producción, configurar orígenes específicos
    credentials: true,
  },
})
export class WebSocketGatewayHandler
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGatewayHandler.name);

  constructor(private readonly connectionManager: ConnectionManagerService) {}

  /**
   * Maneja nuevas conexiones
   */
  handleConnection(client: Socket): void {
    const clientId = client.id;

    // Obtener IP del cliente
    // En producción, considerar headers X-Forwarded-For si hay proxy
    const ip = this.getClientIp(client);

    this.logger.log(`Cliente conectado: ${clientId} desde IP: ${ip}`);

    // Registrar cliente
    this.connectionManager.registerClient(clientId, ip, client);

    // Log endpoint para acceder al contenido del cliente
    const endpoint = `http://localhost:3000/${ip}/`;
    this.logger.log(`Endpoint para acceder al contenido: ${endpoint}`);
    this.logger.log(`Ejemplo: ${endpoint}index.html`);

    // Enviar confirmación de conexión
    client.emit('message', {
      type: 'ping',
      payload: null,
    });
  }

  /**
   * Maneja desconexiones
   */
  handleDisconnect(client: Socket): void {
    const clientId = client.id;
    this.logger.log(`Cliente desconectado: ${clientId}`);
    this.connectionManager.unregisterClient(clientId);
  }

  /**
   * Maneja mensajes recibidos de clientes
   */
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: WebSocketMessage,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.debug(`Mensaje recibido de ${client.id}: ${message.type}`);

    switch (message.type) {
      case 'response':
        // Procesar respuesta HTTP
        if (message.payload) {
          this.connectionManager.handleResponse(
            message.payload as HttpResponse,
          );
        }
        break;

      case 'pong':
        // Respuesta a ping
        this.logger.debug(`Pong recibido de ${client.id}`);
        break;

      case 'error':
        // Error del cliente
        this.logger.error(`Error del cliente ${client.id}:`, message.payload);
        break;

      default:
        this.logger.warn(`Tipo de mensaje desconocido: ${message.type}`);
    }
  }

  /**
   * Obtiene la IP del cliente desde el socket
   */
  private getClientIp(client: Socket): string {
    // Intentar obtener IP real considerando proxies
    const forwarded = client.handshake.headers['x-forwarded-for'];

    if (forwarded) {
      // x-forwarded-for puede contener múltiples IPs separadas por coma
      const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
      return ips.split(',')[0].trim();
    }
    
    // Fallback a la IP directa del socket
    return client.handshake.address || 'unknown';
  }

  /**
   * Envía un ping a todos los clientes conectados
   */
  pingAllClients(): void {
    this.server.emit('message', {
      type: 'ping',
      payload: null,
    });
  }
}

