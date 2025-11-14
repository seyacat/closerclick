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
  console.log('=== REQUEST RECIBIDO ===');
  console.log('Método:', request.method);
  console.log('Path:', request.path);
  console.log('ID del request:', request.id);
  
  // Log de headers
  if (request.headers && Object.keys(request.headers).length > 0) {
    console.log('Headers recibidos:');
    Object.entries(request.headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  }
  
  // Log de query parameters
  if (request.query && Object.keys(request.query).length > 0) {
    console.log('Query parameters:');
    Object.entries(request.query).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  }
  
  // Log del body si existe
  if (request.body) {
    console.log('Body recibido:');
    console.log('  Tipo:', typeof request.body);
    console.log('  Longitud:', request.body.length || request.body.byteLength);
    
    // Si es un Buffer/ArrayBuffer, mostrar primeros bytes como ejemplo
    if (Buffer.isBuffer(request.body)) {
      console.log('  Primeros 50 bytes (hex):', request.body.slice(0, 50).toString('hex'));
    } else if (typeof request.body === 'string') {
      console.log('  Contenido (primeros 100 caracteres):', request.body.substring(0, 100));
    }
  }
  console.log('========================');

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

    // Leer el archivo como Buffer (equivalente a ArrayBuffer en Node.js)
    const content = fs.readFileSync(fullPath);
    
    // Determinar content-type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = getContentType(ext);

    // Estrategia híbrida para archivos grandes
    const MAX_STRING_SIZE = 1024 * 1024; // 1MB
    
    if (content.length < MAX_STRING_SIZE) {
      // Archivos pequeños: enviar como string UTF-8
      console.log(`Enviando archivo pequeño (${content.length} bytes) como string`);
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
          body: content.toString('utf8')
        }
      });
    } else {
      // Archivos grandes: enviar como ArrayBuffer con binary attachment
      console.log(`Enviando archivo grande (${content.length} bytes) como ArrayBuffer`);
      socket.emit('message', {
        type: 'response',
        payload: {
          id: request.id,
          statusCode: 200,
          statusMessage: 'OK',
          headers: {
            'content-type': contentType,
            'content-length': content.length.toString(),
            'x-binary-data': 'true' // Indicar que el body viene como binary attachment
          },
          body: null // El body real viene como binary attachment
        }
      }, content); // Binary attachment
    }

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
  const errorBuffer = Buffer.from(message);
  
  if (errorBuffer.length < 1024 * 1024) {
    // Errores pequeños como string
    socket.emit('message', {
      type: 'response',
      payload: {
        id: requestId,
        statusCode: statusCode,
        statusMessage: message,
        headers: {
          'content-type': 'text/plain'
        },
        body: message
      }
    });
  } else {
    // Errores grandes como binary (aunque es raro)
    socket.emit('message', {
      type: 'response',
      payload: {
        id: requestId,
        statusCode: statusCode,
        statusMessage: message.substring(0, 100) + '...',
        headers: {
          'content-type': 'text/plain',
          'x-binary-data': 'true'
        },
        body: null
      }
    }, errorBuffer);
  }
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
