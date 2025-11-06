# CloserClick - Sistema de Gestión

Sistema full-stack desarrollado con Vue.js + TypeScript en el frontend y NestJS en el backend.

## 🚀 Características Principales

- **Frontend Moderno**: Vue 3 con Composition API y TypeScript
- **Backend Robusto**: NestJS con arquitectura modular
- **TypeScript**: Tipado estático en todo el proyecto
- **Desarrollo Ágil**: Hot reload y herramientas modernas

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

El proyecto sigue una arquitectura cliente-servidor con separación clara de responsabilidades:

```
closerclick/
├── api/          # Backend NestJS
├── frontend/     # Frontend Vue.js
└── docs/         # Documentación
```

**Flujo de datos:**
- Frontend Vue.js → API NestJS → Base de Datos
- Comunicación via HTTP/REST
- CORS configurado para desarrollo

## 📚 Documentación Completa

Para información detallada, consulta la documentación en la carpeta [`docs/`](./docs/):

### 📖 Guías Principales
- [**Guía de Instalación**](./docs/INSTALLATION.md) - Configuración completa del entorno
- [**Arquitectura del Sistema**](./docs/ARCHITECTURE.md) - Diseño y estructura técnica
- [**Guía de Desarrollo**](./docs/DEVELOPMENT.md) - Convenciones y mejores prácticas

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
| **Backend** | NestJS, TypeScript, Express |
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
- [Guía de Instalación](./docs/INSTALLATION.md)

---

**¿Listo para empezar?** → [Ver Guía de Instalación Completa](./docs/INSTALLATION.md)
