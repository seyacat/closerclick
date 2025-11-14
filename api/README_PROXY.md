# Sistema de Proxy de Contenido via WebSocket

## Descripción

Este sistema permite que el API NestJS actúe como proxy de contenido, recibiendo requests HTTP en `/{ip}/*` y reenviándolos a clientes conectados via WebSocket según su dirección IP.

## Arquitectura

```
Cliente HTTP → API NestJS (/{ip}/*) → WebSocket → Cliente WebSocket → Contenido
                    ↑                                      ↓
                    └──────────────── Response ────────────┘
```

## Componentes

### 1. WebSocket Gateway (`websocket.gateway.ts`)
- Maneja conexiones WebSocket de clientes
- Registra clientes por su IP
- Recibe respuestas HTTP de los clientes

### 2. Connection Manager (`connection-manager.service.ts`)
- Gestiona el registro de clientes conectados
- Mapea IPs a conexiones WebSocket
- Correlaciona requests HTTP con responses usando IDs únicos
- Maneja timeouts de requests

### 3. Proxy Controller (`proxy.controller.ts`)
- Endpoint `GET/POST/etc /ip/*` - Proxy de contenido
- Endpoint `GET /ip` - Verificar estado de conexión
- Extrae la IP real del cliente (considerando proxies)

### 4. Proxy Service (`proxy.service.ts`)
- Lógica de negocio para el proxy
- Envía requests a clientes WebSocket
- Maneja respuestas y errores

### 5. Stats Controller (`stats.controller.ts`)
- Endpoint `GET /api/stats` - Estadísticas de conexiones

## Protocolo WebSocket

### Mensaje de Request (API → Cliente)
```json
{
  "type": "request",
  "payload": {
    "id": "uuid-v4",
    "method": "GET",
    "path": "/index.html",
    "headers": {
      "user-agent": "...",
      "accept": "..."
    },
    "query": {},
    "body": null
  }
}
```

### Mensaje de Response (Cliente → API)
```json
{
  "type": "response",
  "payload": {
    "id": "uuid-v4",
    "statusCode": 200,
    "statusMessage": "OK",
    "headers": {
      "content-type": "text/html",
      "content-length": "1234"
    },
    "body": "base64-encoded-content"
  }
}
```

## Flujo de Operación

1. **Cliente WebSocket se conecta**
   - Se registra su IP en el ConnectionManager (ej: `192.168.1.100`)
   - Si ya existía una conexión con esa IP, se reemplaza

2. **Cliente HTTP hace request a `/{ip}/ruta`**
   - El ProxyController extrae la IP del parámetro de ruta (ej: `/192.168.1.100/index.html`)
   - Busca si hay un cliente WebSocket con esa IP
   - Si existe, envía el request via WebSocket
   - Espera la respuesta (timeout: 30 segundos)
   - Retorna la respuesta al cliente HTTP

3. **Cliente WebSocket procesa el request**
   - Recibe el mensaje tipo "request"
   - Lee el archivo solicitado
   - Envía respuesta tipo "response" con el contenido

4. **API retorna contenido**
   - Recibe la respuesta del cliente WebSocket
   - Decodifica el contenido (si está en base64)
   - Envía la respuesta al cliente HTTP original

## Endpoints

### `GET/POST/PUT/DELETE/etc /{ip}/*`
Proxy de contenido. `{ip}` es la IP del cliente WebSocket destino, y `*` es la ruta del archivo.

**Ejemplos:**
```
GET http://localhost:3000/192.168.1.100/index.html
→ Se envía al cliente WebSocket con IP 192.168.1.100
→ Cliente retorna contenido de index.html
→ API retorna el contenido al cliente HTTP

GET http://localhost:3000/::1/styles.css
→ Se envía al cliente WebSocket con IP ::1 (IPv6 localhost)
→ Cliente retorna contenido de styles.css

GET http://localhost:3000/127.0.0.1/
→ Se envía al cliente WebSocket con IP 127.0.0.1
→ Cliente retorna contenido del archivo raíz (index.html)
```

### `GET /{ip}`
Verifica si hay un cliente WebSocket conectado con la IP especificada.

**Ejemplo:**
```
GET http://localhost:3000/192.168.1.100
```

**Respuesta:**
```json
{
  "ip": "192.168.1.100",
  "connected": true,
  "timestamp": "2025-11-14T..."
}
```

### `GET /api/stats`
Estadísticas del sistema.

**Respuesta:**
```json
{
  "totalClients": 2,
  "pendingRequests": 0,
  "clients": [
    {
      "clientId": "socket-id-1",
      "ip": "192.168.1.100",
      "connectedAt": "2025-11-14T..."
    }
  ]
}
```

## Configuración

### CORS
El servidor está configurado con CORS abierto (`origin: '*'`). En producción, configurar orígenes específicos.

### Trust Proxy
El servidor confía en headers de proxy (`trust proxy: true`) para obtener la IP real del cliente.

### Timeout
Los requests tienen un timeout de 30 segundos por defecto.

## Manejo de Errores

- **503 Service Unavailable**: No hay cliente WebSocket conectado con esa IP
- **504 Gateway Timeout**: El cliente WebSocket no respondió a tiempo
- **500 Internal Server Error**: Error interno del servidor

## Iniciar el Servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor escuchará en el puerto 3000 por defecto.
WebSocket estará disponible en `ws://localhost:3000`

