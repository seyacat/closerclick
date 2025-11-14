import { Controller, Get } from '@nestjs/common';
import { ProxyService } from './proxy.service';

/**
 * Controlador para estadísticas y debugging
 */
@Controller('api/stats')
export class StatsController {
  constructor(private readonly proxyService: ProxyService) {}

  /**
   * Obtiene estadísticas de conexiones y requests
   */
  @Get()
  getStats() {
    return this.proxyService.getStats();
  }
}

