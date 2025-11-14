# Guía de Instalación

## Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **Git** (para clonar el repositorio)

## Instalación del Proyecto

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd closerclick
```

### 2. Instalar Dependencias Globales

```bash
# Instalar dependencias del proyecto raíz
npm install

# Instalar dependencias del backend
cd api
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 3. Configuración del Entorno

#### Backend (API NestJS)
```bash
cd api

# Variables de entorno (crear archivo .env si es necesario)
# PORT=3000
# DATABASE_URL=tu_url_de_base_de_datos
```

#### Frontend (Vue.js)
```bash
cd frontend

# El frontend se conecta automáticamente a localhost:3000
# Para cambiar la URL de la API, modificar las llamadas HTTP en los componentes
```

## Ejecución del Proyecto

### Desarrollo

```bash
# Desde la raíz del proyecto
npm run dev:api        # Inicia API en puerto 3000
npm run dev:frontend   # Inicia frontend en puerto 5173
```

O ejecutar individualmente:

```bash
# Backend
cd api
npm run start:dev

# Frontend
cd frontend
npm run dev
```

### Producción

```bash
# Build de ambos proyectos
npm run build:api
npm run build:frontend

# Ejecutar en producción
cd api
npm run start:prod
```

## Verificación de la Instalación

1. **API NestJS**: Abrir http://localhost:3000/api
2. **Frontend Vue.js**: Abrir http://localhost:5173
3. **Estado del Sistema**: Verificar en http://localhost:5173 que muestre "API conectada correctamente"
4. **WebSocket**: Verificar que el servidor muestre "WebSocket disponible en ws://localhost:3000"

## Configuración del Proxy WebSocket

### Para usar el sistema de proxy:

1. **Conectar Cliente WebSocket**:
   - Un cliente WebSocket debe conectarse al servidor
   - El cliente debe servir contenido local
   - Se registrará automáticamente por su IP

2. **Acceder al Contenido**:
   - Usar URLs como `http://localhost:3000/{ip}/ruta`
   - Donde `{ip}` es la IP del cliente WebSocket
   - Ejemplo: `http://localhost:3000/127.0.0.1/index.html`

3. **Verificar Conexiones**:
   - Usar `http://localhost:3000/api/stats` para ver clientes conectados
   - Usar `http://localhost:3000/{ip}` para verificar conexión específica

### Ejemplo de Uso:
```bash
# Verificar estado del sistema
curl http://localhost:3000/api/health

# Ver clientes conectados
curl http://localhost:3000/api/stats

# Acceder a contenido (reemplazar IP con la real)
curl http://localhost:3000/127.0.0.1/index.html
```

## Solución de Problemas Comunes

### Error de CORS
- Verificar que ambos servidores estén ejecutándose
- Confirmar que la API esté en puerto 3000 y frontend en 5173

### Dependencias no Instaladas
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Puerto Ocupado
```bash
# Cambiar puerto en el backend
cd api
# Modificar main.ts o usar variable de entorno PORT
```

## Próximos Pasos

- [Configurar Base de Datos](./DATABASE.md)
- [Revisar Arquitectura del Sistema](./ARCHITECTURE.md)
- [Configurar ESLint y Prettier](./DEVELOPMENT.md)