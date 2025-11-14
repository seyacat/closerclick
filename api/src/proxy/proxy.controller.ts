import {
  Controller,
  All,
  Req,
  Res,
  Logger,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

/**
 * Controlador para manejar requests de proxy
 */
@Controller()
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(private readonly proxyService: ProxyService) {}

  /**
   * Maneja todos los requests a /:ip/*
   * Donde :ip es la IP del cliente WebSocket al que queremos acceder
   */
  @All(':ip/*')
  async handleIpProxy(
    @Param('ip') targetIp: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // Extraer la ruta después de /:ip/
    const fullPath = req.path;
    const pathAfterIp = fullPath.substring(fullPath.indexOf(targetIp) + targetIp.length) || '/';

    this.logger.log(`Request para IP ${targetIp}: ${req.method} ${pathAfterIp}`);

    try {
      // Enviar request al cliente WebSocket correspondiente
      const response = await this.proxyService.proxyRequest(targetIp, {
        method: req.method as any,
        path: pathAfterIp,
        headers: req.headers as any,
        body: req.body ? JSON.stringify(req.body) : undefined,
        query: req.query as any,
      });

      // Enviar respuesta al cliente HTTP
      res.status(response.statusCode);
      
      // Establecer headers
      if (response.headers) {
        Object.entries(response.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }

      // Enviar body
      if (response.body) {
        // Si el body está en base64, decodificarlo
        if (this.isBase64(response.body)) {
          const buffer = Buffer.from(response.body, 'base64');
          res.send(buffer);
        } else {
          res.send(response.body);
        }
      } else {
        res.end();
      }

      this.logger.log(`Respuesta enviada: ${response.statusCode} para ${pathAfterIp}`);
    } catch (error) {
      this.logger.error(`Error al procesar request: ${error.message}`);

      if (error.message.includes('No hay cliente conectado')) {
        throw new HttpException(
          `No hay cliente conectado con IP: ${targetIp}`,
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      if (error.message.includes('Timeout')) {
        throw new HttpException(
          'Timeout esperando respuesta del cliente',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Endpoint para verificar el estado de conexión de una IP específica
   * y servir contenido si se solicita la raíz
   */
  @All(':ip')
  async handleIpRoot(
    @Param('ip') targetIp: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // Para requests a la raíz de la IP, servir contenido por defecto
    await this.handleIpProxy(targetIp, req, res);
  }

  /**
   * Verifica si una cadena es base64 válida
   */
  private isBase64(str: string): boolean {
    try {
      return Buffer.from(str, 'base64').toString('base64') === str;
    } catch {
      return false;
    }
  }
}

