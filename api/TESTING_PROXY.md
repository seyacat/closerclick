# Guía de Pruebas del Sistema de Proxy

## Requisitos Previos

1. Servidor API corriendo en `http://localhost:3000`
2. Cliente WebSocket conectado (desde `D:\closerclick_webpage`)

## Paso 1: Iniciar el Servidor API

```bash
cd api
npm run start:dev
```

Deberías ver:
```
Aplicación escuchando en puerto 3000
WebSocket disponible en ws://localhost:3000
```

## Paso 2: Conectar Cliente WebSocket

Desde el proyecto `D:\closerclick_webpage`:

1. Configurar el servidor en la interfaz:
   - Host: `localhost`
   - Port: `3000`

2. Seleccionar carpeta con contenido estático

3. Hacer clic en "Conectar"

El servidor API debería mostrar:
```
Cliente conectado: <socket-id> desde IP: 127.0.0.1
Cliente registrado: <socket-id> (IP: 127.0.0.1)
Total de clientes conectados: 1
```

## Paso 3: Identificar la IP del Cliente WebSocket

Primero necesitas saber con qué IP se conectó tu cliente WebSocket. Usa el endpoint de debug:

```bash
curl http://localhost:3000/api/debug/myip
```

O el endpoint de estadísticas:
```bash
curl http://localhost:3000/api/stats
```

Esto te mostrará algo como:
```json
{
  "totalClients": 1,
  "clients": [
    {
      "clientId": "...",
      "ip": "::1",  // ← Esta es la IP que necesitas
      "connectedAt": "..."
    }
  ]
}
```

**Nota:** La IP puede ser:
- `::1` (IPv6 localhost)
- `127.0.0.1` (IPv4 localhost)
- Cualquier otra IP de la red

## Paso 4: Verificar Conexión de una IP Específica

```bash
# Verificar si la IP ::1 está conectada
curl http://localhost:3000/::1

# O para IPv4
curl http://localhost:3000/127.0.0.1
```

Respuesta esperada:
```json
{
  "ip": "::1",
  "connected": true,
  "timestamp": "2025-11-14T..."
}
```

## Paso 5: Probar Proxy de Contenido

**IMPORTANTE:** Reemplaza `::1` con la IP que obtuviste en el Paso 3.

### Solicitar archivo raíz
```bash
# Si tu cliente está conectado con IP ::1
curl http://localhost:3000/::1/

# Si tu cliente está conectado con IP 127.0.0.1
curl http://localhost:3000/127.0.0.1/
```

### Solicitar archivo HTML específico
```bash
curl http://localhost:3000/::1/index.html
```

### Solicitar archivo CSS
```bash
curl http://localhost:3000/::1/styles.css
```

### Solicitar archivo JavaScript
```bash
curl http://localhost:3000/::1/app.js
```

### Probar desde el navegador
Abre en tu navegador (reemplaza `::1` con tu IP):
```
http://localhost:3000/::1/
```

O para IPv4:
```
http://localhost:3000/127.0.0.1/
```

Deberías ver el contenido servido desde el cliente WebSocket.

## Logs Esperados

### En el Servidor API:
```
Request para IP ::1: GET /index.html
Respuesta recibida para request <uuid>: 200
Respuesta enviada: 200 para /index.html
```

### En el Cliente WebSocket:
```
Recibido request: GET /index.html
Enviada respuesta: 200 OK para /index.html
```

## Casos de Error

### Error 503: Cliente no conectado
Si intentas acceder a una IP que no tiene cliente WebSocket conectado:
```bash
curl http://localhost:3000/192.168.1.999/test.html
```

Respuesta:
```json
{
  "statusCode": 503,
  "message": "No hay cliente conectado con IP: 192.168.1.999"
}
```

### Error 504: Timeout
Si el cliente WebSocket no responde en 30 segundos:
```json
{
  "statusCode": 504,
  "message": "Timeout esperando respuesta del cliente"
}
```

### Error 404: Archivo no encontrado
Si el archivo no existe en el cliente:
```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```

## Pruebas con Diferentes IPs

Para probar con diferentes IPs (simulando múltiples clientes):

1. Conecta múltiples clientes WebSocket desde diferentes máquinas
2. Cada cliente se registrará con su IP única
3. Los requests HTTP se enrutarán al cliente correspondiente según la IP

## Debugging

### Ver todas las conexiones activas
```bash
curl http://localhost:3000/api/stats
```

### Ver logs detallados
El servidor muestra logs de:
- Conexiones/desconexiones de clientes
- Requests recibidos y enviados
- Respuestas procesadas
- Errores

### Verificar que Socket.IO está funcionando
Abre en el navegador:
```
http://localhost:3000/socket.io/socket.io.js
```

Deberías recibir el archivo JavaScript de Socket.IO.

## Notas Importantes

1. **IP Local**: En desarrollo local, todos los requests vendrán de `127.0.0.1` o `::1`
2. **Múltiples Clientes**: Solo puede haber un cliente WebSocket por IP
3. **Timeout**: Los requests tienen un timeout de 30 segundos
4. **Base64**: El contenido binario se envía codificado en base64
5. **CORS**: Está habilitado para todos los orígenes en desarrollo

