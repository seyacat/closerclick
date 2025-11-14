import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*', // En producción, configurar orígenes específicos
    credentials: true,
  });

  // Configurar carpeta pública
  app.useStaticAssets(join(__dirname, 'public'), {
    prefix: '/public/',
  });

  // Configurar para obtener IP real del cliente
  app.set('trust proxy', true);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Aplicación escuchando en puerto ${port}`);
  logger.log(`WebSocket disponible en ws://localhost:${port}`);
}
void bootstrap();
