/**
 * Métodos HTTP soportados
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * Headers HTTP como objeto clave-valor
 */
export interface HttpHeaders {
  [key: string]: string | string[];
}

/**
 * Request HTTP recibido del cliente HTTP
 */
export interface HttpRequest {
  id: string; // ID único para correlacionar request/response
  method: HttpMethod;
  path: string;
  headers: HttpHeaders;
  body?: string | null;
  query?: Record<string, string | string[]>;
}

/**
 * Response HTTP recibido via WebSocket
 */
export interface HttpResponse {
  id: string; // Mismo ID del request
  statusCode: number;
  statusMessage?: string;
  headers: HttpHeaders;
  body: string;
}

/**
 * Mensaje WebSocket genérico
 */
export interface WebSocketMessage {
  type: 'request' | 'response' | 'ping' | 'pong' | 'error';
  payload: HttpRequest | HttpResponse | ErrorPayload | null;
}

/**
 * Payload de error
 */
export interface ErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Información de cliente conectado
 */
export interface ConnectedClient {
  clientId: string;
  ip: string;
  connectedAt: Date;
  socket: any; // Socket.IO socket
}

