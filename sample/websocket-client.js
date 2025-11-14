const { io } = require('socket.io-client');
const fs = require('fs');
const path = require('path');

// Configuración
const SERVER_URL = 'ws://localhost:3000';
const CONTENT_DIR = __dirname;

// Crear cliente WebSocket
const socket = io(SERVER_URL, {
  transports: ['websocket']
});

console.log('Conectando al servidor WebSocket...');

socket.on('connect', () => {
  console.log('✅ Conectado al servidor WebSocket');
  console.log('ID del cliente:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Desconectado del servidor WebSocket');
});

socket.on('message', (message) => {
  console.log('Mensaje recibido:', message.type);

  switch (message.type) {
    case 'ping':
      // Responder al ping
      socket.emit('message', {
        type: 'pong',
        payload: null
      });
      break;

    case 'request':
      // Procesar request HTTP
      handleHttpRequest(message.payload);
      break;

    default:
      console.log('Tipo de mensaje desconocido:', message.type);
  }
});

/**
 * Maneja un request HTTP recibido del servidor
 */
function handleHttpRequest(request) {
  console.log('Request HTTP recibido:', request.method, request.path);

  try {
    // Determinar el archivo a servir
    let filePath = request.path;
    if (filePath === '/') {
      filePath = '/index.html';
    }

    const fullPath = path.join(CONTENT_DIR, filePath);

    // Verificar si el archivo existe
    if (!fs.existsSync(fullPath)) {
      sendErrorResponse(request.id, 404, 'Archivo no encontrado');
      return;
    }

    // Leer el archivo
    const content = fs.readFileSync(fullPath);
    
    // Determinar content-type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = getContentType(ext);

    // Enviar respuesta
    socket.emit('message', {
      type: 'response',
      payload: {
        id: request.id,
        statusCode: 200,
        statusMessage: 'OK',
        headers: {
          'content-type': contentType,
          'content-length': content.length.toString()
        },
        body: content.toString('base64')
      }
    });

    console.log('Respuesta enviada para:', filePath);

  } catch (error) {
    console.error('Error procesando request:', error);
    sendErrorResponse(request.id, 500, 'Error interno del servidor');
  }
}

/**
 * Envía una respuesta de error
 */
function sendErrorResponse(requestId, statusCode, message) {
  socket.emit('message', {
    type: 'response',
    payload: {
      id: requestId,
      statusCode: statusCode,
      statusMessage: message,
      headers: {
        'content-type': 'text/plain'
      },
      body: Buffer.from(message).toString('base64')
    }
  });
}

/**
 * Obtiene el content-type basado en la extensión del archivo
 */
function getContentType(extension) {
  const contentTypes = {
    '.html': 'text/html',
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain'
  };

  return contentTypes[extension] || 'application/octet-stream';
}

// Manejar cierre del proceso
process.on('SIGINT', () => {
  console.log('\nCerrando cliente WebSocket...');
  socket.disconnect();
  process.exit(0);
});
