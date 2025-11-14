import { Injectable, Logger } from '@nestjs/common';
import { ConnectionManagerService } from '../websocket/connection-manager.service';
import { HttpRequest, HttpResponse } from '../types/websocket.types';

/**
 * Servicio para manejar el proxy de requests HTTP via WebSocket
 */
@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly connectionManager: ConnectionManagerService) {}

  /**
   * Envía un request HTTP a través del WebSocket correspondiente a la IP
   */
  async proxyRequest(
    clientIp: string,
    request: Omit<HttpRequest, 'id'>,
  ): Promise<HttpResponse> {
    this.logger.debug(`Proxying request para IP ${clientIp}: ${request.method} ${request.path}`);

    try {
      const response = await this.connectionManager.sendRequestToClient(
        clientIp,
        request,
        30000, // 30 segundos de timeout
      );

      return response;
    } catch (error) {
      this.logger.error(`Error al hacer proxy del request: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verifica si hay un cliente conectado con la IP especificada
   */
  isClientConnected(ip: string): boolean {
    const client = this.connectionManager.getClientByIp(ip);
    return !!client;
  }

  /**
   * Obtiene estadísticas del servicio de proxy
   */
  getStats() {
    return this.connectionManager.getStats();
  }
}

