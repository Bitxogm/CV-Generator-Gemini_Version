# Guía de instalación — TalentHub

## Requisitos previos

- Node.js `>=20` ([nvm](https://github.com/nvm-sh/nvm) recomendado)
- pnpm `>=9` (`npm install -g pnpm`)
- Docker + Docker Compose

Verificar:
```bash
node -v      # >= 20.x
pnpm -v      # >= 9.x
docker -v
```

## 1. Clonar el repositorio

```bash
git clone https://github.com/Bitxogm/CV-Generator-Gemini_Version.git
cd CV-Generator-Gemini_Version
```

## 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Editar `backend/.env` con los valores reales:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Conexión PostgreSQL (ya preconfigurada para Docker local) |
| `JWT_SECRET` | String aleatorio seguro (mín. 32 chars) |
| `JWT_EXPIRES_IN` | Expiración del token, ej: `7d` |
| `GEMINI_API_KEY` | API key de [Google AI Studio](https://aistudio.google.com/) |
| `SMTP_HOST` | Servidor SMTP (ej: `smtp.gmail.com`) |
| `SMTP_PORT` | Puerto SMTP (ej: `587`) |
| `SMTP_USER` | Email SMTP |
| `SMTP_PASS` | App password del email |
| `SMTP_FROM` | Remitente, ej: `TalentHub <noreply@talenthub.com>` |
| `FRONTEND_URL` | `http://localhost:8080` |
| `PORT` | `3001` |
| `NODE_ENV` | `development` |
| `CORS_ORIGIN` | `http://localhost:8080` |

Editar `frontend/.env`:

| Variable | Descripción |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | La misma API key de Gemini |
| `VITE_API_URL` | `http://localhost:3001` |

## 3. Instalar dependencias

Desde la raíz del monorepo:

```bash
pnpm install
```

Esto instala las dependencias de todos los packages (`backend`, `frontend`) en un único `node_modules` compartido.

## 4. Arrancar el proyecto

### Opción A: Todo en Docker (recomendado para primera vez)

Levanta PostgreSQL, backend y frontend en contenedores:

```bash
pnpm docker:dev
```

Equivalente a: `docker-compose -f docker-compose.dev.yml up`

Los contenedores incluyen hot-reload via volúmenes montados.

### Opción B: Híbrido (postgres en Docker, apps en local)

Útil si quieres logs directos o debugger en el backend:

```bash
pnpm dev
```

Esto lanza en paralelo:
- `docker-compose up postgres` (contenedor)
- `pnpm --filter backend dev` (nodemon local)
- `pnpm --filter frontend dev` (vite local)

## 5. Verificar el arranque

| Servicio | URL | Comprobación |
|---------|-----|-------------|
| Frontend | http://localhost:8080 | App React en el navegador |
| Backend API | http://localhost:3001 | `GET /health` devuelve `200` |
| PostgreSQL | localhost:5432 | Accesible desde backend |

## Scripts útiles

```bash
pnpm stop          # Parar contenedores
pnpm clean         # Parar y borrar volúmenes (borra la BD)
pnpm prisma:studio # Abrir Prisma Studio (GUI de la BD)
pnpm test          # Ejecutar tests
pnpm lint          # Lint en todos los packages
pnpm build         # Build de producción
```

## Solución de problemas comunes

**Puerto ya en uso:**
```bash
pnpm clean-ports
```

**Prisma client desactualizado:**
```bash
pnpm prisma:generate
```

**Limpiar todo y empezar de cero:**
```bash
pnpm clean          # Borra volúmenes Docker
pnpm install        # Reinstala dependencias
pnpm docker:dev     # Arranca limpio
```
