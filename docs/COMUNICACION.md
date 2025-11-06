# Diagrama de Comunicación - CloserClick

## Flujo de Comunicación del Sistema

```mermaid
sequenceDiagram
    participant U as Usuario
    participant LB as Load Balancer/Proxy
    participant API as API NestJS
    participant WS as WebSocket Server
    participant PM as Máquina Privada
    participant PWA as Aplicación PWA

    Note over U, PWA: Solicitud IP/DNS
    U->>LB: GET closer.click/ip<br/>o closer.click/dns
    LB->>API: Proxea solicitud
    
    Note over API, PM: Resolución y Conexión
    API->>WS: Verifica conexión WebSocket
    WS->>PM: Establece conexión segura
    
    Note over PM, PWA: Obtención de Contenido
    PM->>PWA: Solicita contenido basado en URL
    PWA->>PM: Retorna HTML/Contenido
    
    Note over PM, U: Retorno al Usuario
    PM->>WS: Envía contenido HTML
    WS->>API: Retorna datos
    API->>LB: Respuesta con contenido
    LB->>U: HTML renderizado al usuario
```

## Arquitectura de Comunicación

```mermaid
flowchart TD
    A[Usuario] --> B[closer.click/ip<br/>closer.click/dns]
    B --> C[API NestJS<br/>closer.click:3000]
    
    C --> D{¿Conexión WebSocket?}
    D -->|Sí| E[WebSocket Server]
    D -->|No| F[Respuesta Directa]
    
    E --> G[Máquina Privada<br/>Detrás de Firewall]
    G --> H[Aplicación PWA]
    H --> I[Genera Contenido HTML]
    
    I --> G
    G --> E
    E --> C
    C --> B
    B --> A
    
    F --> A
    
    subgraph "Entorno Público"
        B
        C
        E
    end
    
    subgraph "Entorno Privado"
        G
        H
        I
    end
```

## Componentes del Sistema

### 1. **Frontend Público**
- **Dominio**: `closer.click`
- **Endpoints**:
  - `/ip` - Resolución de direcciones IP
  - `/dns` - Consultas de DNS
- **Función**: Proxy inicial y enrutamiento

### 2. **API NestJS**
- **Puerto**: 3000
- **Responsabilidades**:
  - Procesar solicitudes HTTP
  - Gestionar conexiones WebSocket
  - Coordinar comunicación con máquina privada
  - Retornar contenido HTML al usuario

### 3. **Servidor WebSocket**
- **Función**: Conexión persistente con máquina privada
- **Protocolo**: WebSocket seguro
- **Autenticación**: Tokens/credenciales específicas

### 4. **Máquina Privada**
- **Ubicación**: Detrás de firewall corporativo
- **Acceso**: Solo mediante WebSocket autorizado
- **Función**: Host de la aplicación PWA

### 5. **Aplicación PWA**
- **Tipo**: Progressive Web App
- **Responsabilidad**: Generar contenido HTML dinámico
- **Comunicación**: Via WebSocket con API pública

## Flujo Detallado

### Fase 1: Solicitud del Usuario
1. Usuario accede a `closer.click/ip` o `closer.click/dns`
2. Load balancer/proxy recibe la solicitud
3. Request es enrutado al API NestJS

### Fase 2: Procesamiento del API
1. API valida la solicitud
2. Verifica si existe conexión WebSocket activa
3. Si hay conexión, procede con la solicitud
4. Si no hay conexión, retorna error o intenta establecerla

### Fase 3: Comunicación con Máquina Privada
1. WebSocket Server envía solicitud a máquina privada
2. Máquina privada ejecuta la aplicación PWA
3. PWA genera contenido basado en la URL solicitada
4. Contenido HTML es retornado a través del WebSocket

### Fase 4: Respuesta al Usuario
1. API recibe el contenido HTML
2. Formatea la respuesta HTTP
3. Retorna el HTML al usuario final
4. Usuario ve el contenido renderizado

## Consideraciones de Seguridad

- **Firewall**: La máquina privada está protegida
- **WebSocket**: Conexión segura y autenticada
- **Proxy**: El API actúa como intermediario seguro
- **Contenido**: Solo HTML es retornado al usuario

## Configuración de Puertos y URLs

| Componente | URL/Puerto | Propósito |
|------------|------------|-----------|
| Frontend Público | `closer.click` | Punto de entrada |
| API NestJS | `closer.click:3000` | Procesamiento backend |
| WebSocket | `wss://closer.click/ws` | Comunicación privada |
| Máquina Privada | Interno | Host PWA |
| PWA | Interno | Generación contenido |

## Dependencias y Requisitos

- **Conexión WebSocket**: Requerida para acceso a máquina privada
- **Autenticación**: Credenciales para conexión segura
- **Firewall**: Configuración para permitir WebSocket específico
- **PWA**: Aplicación funcionando en máquina privada