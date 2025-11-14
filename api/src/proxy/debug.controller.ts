import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ProxyService } from './proxy.service';

/**
 * Controlador para debugging y diagnóstico
 */
@Controller('api/debug')
export class DebugController {
  constructor(private readonly proxyService: ProxyService) {}

  /**
   * Muestra información detallada sobre la IP detectada y conexiones
   */
  @Get('myip')
  getMyIp(@Req() req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedIp = forwarded
      ? Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0].trim()
      : null;

    const detectedIp = this.getClientIp(req);
    const isConnected = this.proxyService.isClientConnected(detectedIp);
    const stats = this.proxyService.getStats();

    return {
      detectedIp,
      isConnected,
      ipSources: {
        'x-forwarded-for': req.headers['x-forwarded-for'] || null,
        'x-real-ip': req.headers['x-real-ip'] || null,
        'req.ip': req.ip || null,
        'socket.remoteAddress': req.socket.remoteAddress || null,
        'computed-forwarded': forwardedIp,
      },
      allConnectedClients: stats.clients.map((c) => ({
        ip: c.ip,
        clientId: c.clientId,
        connectedAt: c.connectedAt,
      })),
      totalClients: stats.totalClients,
      pendingRequests: stats.pendingRequests,
      hint: isConnected
        ? `✅ Tu IP (${detectedIp}) está conectada. Puedes acceder a http://localhost:3000/ip/`
        : `❌ Tu IP (${detectedIp}) NO está conectada. Clientes conectados: ${stats.clients.map((c) => c.ip).join(', ')}`,
    };
  }

  /**
   * Obtiene la IP del cliente
   */
  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];

    if (forwarded) {
      const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
      return ips.split(',')[0].trim();
    }

    return req.ip || req.socket.remoteAddress || 'unknown';
  }
}

