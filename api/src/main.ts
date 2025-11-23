import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { existsSync, readdirSync } from 'fs';
import { Request, Response } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log(
    '=== INICIANDO SERVIDOR CON CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS ===',
  );
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar carpeta pública ANTES de inicializar la aplicación
  const publicPath = join(__dirname, 'public');
  const absolutePublicPath = join(process.cwd(), 'src', 'public');
  logger.log(`Configurando archivos estáticos desde: ${publicPath}`);
  logger.log(`Ruta absoluta esperada: ${absolutePublicPath}`);
  logger.log(`Directorio de trabajo actual: ${process.cwd()}`);
  logger.log(`__dirname: ${__dirname}`);
  
  // Verificar si existe el directorio público
  if (existsSync(absolutePublicPath)) {
    logger.log(`Directorio público encontrado: ${absolutePublicPath}`);
    const files = readdirSync(absolutePublicPath);
    logger.log(`Archivos en directorio público: ${files.join(', ')}`);
  } else {
    logger.error(`Directorio público NO encontrado: ${absolutePublicPath}`);
  }
  
  // Usar ambas rutas para desarrollo y producción
  app.useStaticAssets(publicPath, {
    prefix: '/public/',
  });
  app.useStaticAssets(absolutePublicPath, {
    prefix: '/public/',
  });

  // Servir archivos estáticos en la ruta raíz desde el directorio public
  app.useStaticAssets(absolutePublicPath, {
    prefix: '/',
    index: 'index.html',
  });

  // Habilitar CORS
  app.enableCors({
    origin: '*', // En producción, configurar orígenes específicos
    credentials: true,
  });

  // Configurar para obtener IP real del cliente
  app.set('trust proxy', true);

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('CloserClick API')
    .setDescription('API para el sistema CloserClick - Proxy WebSocket')
    .setVersion('1.0')
    .addTag('api', 'Endpoints principales de la API')
    .addTag('proxy', 'Proxy WebSocket')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Aplicación escuchando en puerto ${port}`);
  logger.log(`WebSocket disponible en ws://localhost:${port}`);
  logger.log(
    `Archivos estáticos disponibles en http://localhost:${port}/public/`,
  );
  logger.log(`Documentación Swagger disponible en http://localhost:${port}/api`);
}
void bootstrap();
