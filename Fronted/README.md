# Gestión de Productos — Frontend React + TypeScript

Frontend de la aplicación de gestión de productos, consumiendo la API REST (NestJS + PostgreSQL).

## Cómo correr el proyecto localmente

```bash
# 1. Clonar el repo e instalar dependencias
git clone <repo-url>
cd Fronted
npm install

# 2. Configurar variables de entorno
cp .env.example .env   # o crear manualmente
# Editar .env con la URL del backend:
#   VITE_API_URL=http://localhost:3000

# 3. Levantar el backend (en otra terminal)
cd ../Backend
npm install
cp .env.example .env
# Completar DATABASE_URL y JWT_SECRET
npm run migration:run
npm run start:dev

# 4. Levantar el frontend
cd ../Fronted
npm run dev
```

La app corre en http://localhost:5173 (Vite) y la API en http://localhost:3000 (NestJS).

## Cuentas de prueba

- **Admin**: admin@examen.com / Admin123!
- **Usuario regular**: registrar desde /registro

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo con hot reload |
| `npm run build` | Build de producción (tsc + vite build) |
| `npm run lint` | Linting con ESLint |
| `npm run test` | Tests (Vitest) |
| `npm run test:watch` | Tests en modo watch |

---

## Preguntas del examen

### 1. Persistencia de sesión: localStorage vs sessionStorage

**Decisión**: `localStorage`

**Justificación**: La aplicación es de gestión de productos — se espera que un usuario mantenga la sesión abierta mientras trabaja, posiblemente en varias pestañas. `sessionStorage` se perdería al cerrar cada pestaña, forzando login constante. JWT ya tiene expiración server-side; el interceptor de respuesta detecta 401 (token vencido) y limpia la sesión automáticamente, mitigando el riesgo de que un token quede indefinidamente en localStorage.

El token se guarda bajo la clave `gp_access_token` en `src/api/token-storage.ts`, centralizando toda lógica de storage en un solo archivo.

### 2. Librería HTTP: Axios con interceptores

**Librería**: [Axios](https://axios-http.com/)

**Justificación**: El examen pide explícitamente interceptores de request/response para inyectar el token y reaccionar a 401. Axios los trae implementados de forma nativa. Con `fetch` nativo habría que crear un wrapper personalizado, duplicando lógica que Axios ya resuelve. Además, `client.get<T>()` ofrece tipado genérico de la respuesta sin casts adicionales.

**Interceptor de request**: Lee el token de `localStorage` y lo inyecta como `Authorization: Bearer <token>` en todas las peticiones salientes. Solo añade el header si existe token.

**Interceptor de response**: Ante un 401, verifica que la ruta no sea pública (`/auth/login` o `/auth/register` — ahí un 401 significa "credenciales inválidas", no sesión vencida). Si es ruta protegida, limpia el storage y dispara un evento custom `gp:unauthorized` que el `AuthContext` escucha para actualizar el estado de React.

**Clasificación de errores**: La clase `ApiError` clasifica automáticamente los errores en categorías: `network` (backend caído), `validation` (400), `unauthorized` (401), `forbidden` (403), `conflict` (409), `notFound` (404), `server` (5xx). Cada componente puede reaccionar según el tipo sin parsear strings.

### 3. Estructura del proyecto

```
src/
├── api/          Capa de comunicación (Axios, ApiError, token-storage)
├── config/       Variables de entorno tipadas
├── types/        Tipos del dominio y de la API (genéricos, utility types)
├── services/     Un archivo por dominio: auth, categories, products, favorites
├── context/      Context API: AuthContext (sesión) + FavoritesContext
├── hooks/        useFetch<T> (genérico) + useDebounce
├── components/
│   ├── ErrorBoundary.tsx
│   ├── routing/  RequireAuth, RequireRole (RBAC)
│   ├── layout/   AppLayout, Navbar
│   └── ui/       ProductCard, FavoriteButton, Pagination, SafeImage, etc.
├── pages/        Una por ruta
└── lib/          Funciones puras (formatPrice)
```

### 4. Errores de renderizado

El `ErrorBoundary` es un class component (justificado: React no ofrece hooks para capturar errores de renderizado — solo `getDerivedStateFromError` y `componentDidCatch` existen en clases). Envolucra toda la aplicación y muestra un fallback amigable con opción de recargar. En desarrollo, se puede forzar con `?crash=1` en la URL.

### 5. Tests

- **Unitaria**: `formatPrice` — función pura que prueba formato de moneda colombiana y casos edge (NaN, Infinity).
- **Integración**: `LoginPage` — simula completar el formulario y enviarlo con credenciales inválidas; verifica que el mensaje del servidor se muestre en la interfaz (no solo en consola). Mockea únicamente el servicio de auth (`vi.mock`), no toda la aplicación.
