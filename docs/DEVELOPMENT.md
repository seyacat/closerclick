# Guía de Desarrollo

## Estructura de Código

### Backend (NestJS)

```
api/
├── src/
│   ├── main.ts              # Configuración del servidor
│   ├── app.module.ts        # Módulo principal
│   ├── app.controller.ts    # Controlador principal
│   ├── app.service.ts       # Servicio principal
│   └── public/              # Archivos estáticos
├── test/                    # Tests e2e
└── package.json
```

### Frontend (Vue.js)

```
frontend/
├── src/
│   ├── main.ts              # Punto de entrada
│   ├── App.vue              # Componente principal
│   ├── components/          # Componentes Vue
│   ├── assets/              # Recursos estáticos
│   └── style.css            # Estilos globales
├── eslint.config.js         # Configuración ESLint
└── package.json
```

## Convenciones de Código

### TypeScript
- Usar tipos explícitos en funciones y variables
- Evitar `any` cuando sea posible
- Utilizar interfaces para definir estructuras de datos

### Vue.js
- Usar Composition API con `<script setup>`
- Nombrar componentes en PascalCase
- Separar lógica de negocio en composables cuando sea necesario

### NestJS
- Seguir la estructura modular de NestJS
- Usar decorators apropiadamente
- Separar lógica en servicios

## Linting y Formato

### ESLint
El proyecto utiliza ESLint para mantener la calidad del código:

```bash
# Ejecutar linting
cd frontend
npx eslint . --ext .vue,.js,.ts,.jsx,.tsx

# Corregir errores automáticamente
npx eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix
```

### Configuración ESLint
- Reglas de TypeScript habilitadas
- Reglas de Vue.js para SFC
- Browser globals configurados
- Console statements permitidos para desarrollo

## Testing

### Backend (NestJS)
```bash
cd api

# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

### Frontend (Vue.js)
```bash
cd frontend

# Ejecutar tests (si están configurados)
npm run test
```

## Flujo de Desarrollo

### 1. Configuración del Entorno
```bash
# Clonar y configurar
git clone <repo>
npm install
cd api && npm install
cd ../frontend && npm install
```

### 2. Desarrollo Local
```bash
# Terminal 1 - Backend
npm run dev:api

# Terminal 2 - Frontend  
npm run dev:frontend
```

### 3. Verificación de Código
```bash
# Linting antes de commit
cd frontend && npx eslint . --ext .vue,.js,.ts,.jsx,.tsx
cd ../api && npx eslint .
```

## Depuración

### Backend
- Usar `console.log` para debugging básico
- Configurar breakpoints en VS Code
- Revisar logs del servidor NestJS

### Frontend
- Usar Vue DevTools en el navegador
- Console statements en componentes
- Network tab para verificar llamadas HTTP

## Mejores Prácticas

### Seguridad
- Validar datos de entrada en el backend
- Usar CORS configurado apropiadamente
- No exponer información sensible en el frontend

### Performance
- Lazy loading de componentes cuando sea necesario
- Optimizar imágenes y assets
- Minimizar bundle size

### Mantenibilidad
- Código modular y reutilizable
- Documentación clara
- Tests automatizados

## Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com)
- [Documentación de Vue.js](https://vuejs.org/guide)
- [Guía de TypeScript](https://www.typescriptlang.org/docs)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring)