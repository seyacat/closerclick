import { Injectable, Logger } from '@nestjs/common';
import { ConnectedClient, HttpRequest, HttpResponse } from '../types/websocket.types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio para gestionar conexiones WebSocket y correlacionar requests/responses
 */
@Injectable()
export class ConnectionManagerService {
  private readonly logger = new Logger(ConnectionManagerService.name);
  
  // Mapa de clientId -> ConnectedClient
  private clients = new Map<string, ConnectedClient>();
  
  // Mapa de IP -> clientId (para búsqueda rápida por IP)
  private ipToClientId = new Map<string, string>();
  
  // Mapa de requestId -> resolver para promesas pendientes
  private pendingRequests = new Map<string, {
    resolve: (response: HttpResponse) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }>();

  /**
   * Registra un nuevo cliente conectado
   */
  registerClient(clientId: string, ip: string, socket: any): void {
    // Si ya existe un cliente con esta IP, desconectarlo
    const existingClientId = this.ipToClientId.get(ip);
    if (existingClientId) {
      this.logger.warn(`Cliente existente con IP ${ip} será reemplazado`);
      this.unregisterClient(existingClientId);
    }

    const client: ConnectedClient = {
      clientId,
      ip,
      connectedAt: new Date(),
      socket,
    };

    this.clients.set(clientId, client);
    this.ipToClientId.set(ip, clientId);
    
    this.logger.log(`Cliente registrado: ${clientId} (IP: ${ip})`);
    this.logger.log(`Total de clientes conectados: ${this.clients.size}`);
  }

  /**
   * Desregistra un cliente
   */
  unregisterClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      this.ipToClientId.delete(client.ip);
      this.clients.delete(clientId);
      this.logger.log(`Cliente desregistrado: ${clientId} (IP: ${client.ip})`);
      this.logger.log(`Total de clientes conectados: ${this.clients.size}`);
    }
  }

  /**
   * Obtiene un cliente por su IP
   */
  getClientByIp(ip: string): ConnectedClient | undefined {
    const clientId = this.ipToClientId.get(ip);
    if (!clientId) {
      return undefined;
    }
    return this.clients.get(clientId);
  }

  /**
   * Obtiene un cliente por su ID
   */
  getClientById(clientId: string): ConnectedClient | undefined {
    return this.clients.get(clientId);
  }

  /**
   * Envía un request HTTP a un cliente y espera la respuesta
   */
  async sendRequestToClient(
    ip: string,
    request: Omit<HttpRequest, 'id'>,
    timeoutMs: number = 30000,
  ): Promise<HttpResponse> {
    const client = this.getClientByIp(ip);
    
    if (!client) {
      throw new Error(`No hay cliente conectado con IP: ${ip}`);
    }

    const requestId = uuidv4();
    const fullRequest: HttpRequest = {
      ...request,
      id: requestId,
    };

    return new Promise<HttpResponse>((resolve, reject) => {
      // Configurar timeout
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Timeout esperando respuesta del cliente ${ip}`));
      }, timeoutMs);

      // Guardar resolver/reject para cuando llegue la respuesta
      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        timeout,
      });

      // Enviar request al cliente via WebSocket
      try {
        client.socket.emit('message', {
          type: 'request',
          payload: fullRequest,
        });
        this.logger.debug(`Request enviado a cliente ${ip}: ${request.method} ${request.path}`);
      } catch (error) {
        clearTimeout(timeout);
        this.pendingRequests.delete(requestId);
        reject(new Error(`Error al enviar request al cliente: ${error.message}`));
      }
    });
  }

  /**
   * Procesa una respuesta recibida de un cliente
   */
  handleResponse(response: HttpResponse): void {
    const pending = this.pendingRequests.get(response.id);
    
    if (!pending) {
      this.logger.warn(`Respuesta recibida para request desconocido: ${response.id}`);
      return;
    }

    clearTimeout(pending.timeout);
    this.pendingRequests.delete(response.id);
    pending.resolve(response);
    
    this.logger.debug(`Respuesta recibida para request ${response.id}: ${response.statusCode}`);
  }

  /**
   * Obtiene estadísticas de conexiones
   */
  getStats() {
    return {
      totalClients: this.clients.size,
      pendingRequests: this.pendingRequests.size,
      clients: Array.from(this.clients.values()).map(c => ({
        clientId: c.clientId,
        ip: c.ip,
        connectedAt: c.connectedAt,
      })),
    };
  }
}

