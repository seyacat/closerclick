# CloserClick - Sistema de Proxy WebSocket

Sistema de proxy que permite acceder a contenido de máquinas privadas mediante WebSocket. Desarrollado con NestJS en el backend y Vue.js + TypeScript en el frontend.

## 🚀 Características Principales

- **Proxy WebSocket**: Acceso a contenido de máquinas detrás de firewalls
- **Backend NestJS**: Arquitectura modular con WebSocket Gateway
- **Frontend Vue.js**: Interfaz moderna para monitoreo del sistema
- **TypeScript**: Tipado estático en todo el proyecto
- **Comunicación Bidireccional**: Protocolo WebSocket para requests/responses

## 📋 Requisitos del Sistema

- Node.js 18+
- npm
- Git

## ⚡ Inicio Rápido

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd closerclick

# Instalar dependencias
npm install
cd api && npm install
cd ../frontend && npm install
```

### Ejecución

```bash
# Desarrollo (dos terminales)
npm run dev:api        # Backend en puerto 3000
npm run dev:frontend   # Frontend en puerto 5173
```

### Verificación

1. **API**: http://localhost:3000/api
2. **Frontend**: http://localhost:5173
3. **Estado del Sistema**: Verificar conexión API en la interfaz

## 🏗️ Arquitectura del Sistema

El sistema implementa un proxy WebSocket que permite acceder a contenido de máquinas privadas:

```
closerclick/
├── api/          # Backend NestJS con WebSocket Gateway
├── frontend/     # Frontend Vue.js para monitoreo
├── docs/         # Documentación
└── sample/       # Ejemplos y clientes de prueba
```

**Flujo de datos:**
- Cliente HTTP → API NestJS (/{ip}/*) → WebSocket → Cliente WebSocket → Contenido
- Comunicación bidireccional via WebSocket
- Proxy de contenido basado en IP del cliente

## 📚 Documentación Completa

Para información detallada, consulta la documentación en la carpeta [`docs/`](./docs/):

### 📖 Guías Principales
- [**Guía de Instalación**](./docs/INSTALLATION.md) - Configuración completa del entorno
- [**Arquitectura del Sistema**](./docs/ARCHITECTURE.md) - Diseño y estructura técnica
- [**Diagrama de Comunicación**](./docs/COMUNICACION.md) - Flujo de datos y comunicación
- [**Guía de Desarrollo**](./docs/DEVELOPMENT.md) - Convenciones y mejores prácticas

### 🔧 Sistema de Proxy WebSocket
- [**Sistema de Proxy**](./docs/README_PROXY.md) - Arquitectura y protocolo del proxy
- [**Guía de Pruebas**](./docs/TESTING_PROXY.md) - Instrucciones para probar el sistema
- [**Configuración Técnica**](./docs/DEVELOPMENT.md#sistema-de-proxy) - Detalles de implementación

### 🔧 Configuración Técnica
- [Configuración de ESLint](./docs/DEVELOPMENT.md#linting-y-formato) - Estándares de código
- [Testing](./docs/DEVELOPMENT.md#testing) - Estrategias de pruebas
- [Depuración](./docs/DEVELOPMENT.md#depuración) - Herramientas de debugging

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
npm run dev:api        # Inicia servidor backend
npm run dev:frontend   # Inicia servidor frontend
```

### Build
```bash
npm run build:api      # Compila backend
npm run build:frontend # Compila frontend
```

### Linting
```bash
cd frontend && npx eslint . --ext .vue,.js,.ts,.jsx,.tsx
```

## 🎯 Tecnologías Utilizadas

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | Vue 3, TypeScript, Vite, ESLint |
| **Backend** | NestJS, TypeScript, Express, Socket.IO |
| **WebSocket** | Socket.IO, Connection Manager, Proxy Service |
| **Herramientas** | npm, Git, VS Code |

## 📞 Soporte y Contribución

Para reportar issues o contribuir al proyecto:

1. Revisa la [guía de desarrollo](./docs/DEVELOPMENT.md)
2. Sigue las convenciones de código establecidas
3. Ejecuta los tests antes de enviar cambios

## 🔗 Enlaces Rápidos

- [Documentación Completa](./docs/)
- [Configuración de Desarrollo](./docs/DEVELOPMENT.md)
- [Arquitectura Técnica](./docs/ARCHITECTURE.md)
- [Diagrama de Comunicación](./docs/COMUNICACION.md)
- [Guía de Instalación](./docs/INSTALLATION.md)
- [Sistema de Proxy](./docs/README_PROXY.md)
- [Pruebas del Proxy](./docs/TESTING_PROXY.md)

---

**¿Listo para empezar?** → [Ver Guía de Instalación Completa](./docs/INSTALLATION.md)
