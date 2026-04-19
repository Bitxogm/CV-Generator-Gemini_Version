# TalentHub

Marketplace de perfiles profesionales con IA. Permite crear, editar y publicar CVs con asistencia de Gemini AI, autenticación de usuarios y gestión completa desde un panel privado.

## Qué hace este proyecto

- Registro y autenticación con JWT (email/password).
- Editor de CV por secciones: datos personales, resumen, experiencia, educación, skills, proyectos, idiomas.
- Plantillas visuales: `modern`, `professional`, `creative`.
- Exportación a PDF: visual por plantilla (`@react-pdf/renderer`) y optimizado ATS (`jsPDF`).
- Asistente IA (Gemini 2.5 Flash): adaptación a oferta, scoring ATS, carta de presentación.
- Internacionalización ES/EN (`react-i18next`).
- API REST con arquitectura hexagonal (backend Node.js/Express + Prisma + PostgreSQL).

## Stack técnico

**Backend**
- Node.js 20 + TypeScript + Express
- Prisma ORM + PostgreSQL 16
- JWT auth + bcrypt
- Nodemailer (SMTP)
- Vitest (tests)

**Frontend**
- React 18 + TypeScript + Vite 5
- Tailwind CSS + shadcn/ui + Radix UI
- Zustand (estado global)
- TanStack Query
- `@google/generative-ai`
- `@react-pdf/renderer` + `jsPDF`

## Requisitos

- Node.js `>=20`
- pnpm `>=9`
- Docker + Docker Compose

## Instalación rápida

```bash
git clone <repo-url>
cd CV-Generator

# Copiar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Editar backend/.env: añadir GEMINI_API_KEY, JWT_SECRET, SMTP_*
# Editar frontend/.env: añadir VITE_GEMINI_API_KEY

# Instalar dependencias
pnpm install

# Levantar todo con Docker
pnpm docker:dev
```

Ver [INSTALL.md](INSTALL.md) para instrucciones completas y opciones de arranque.

## Scripts principales

| Comando | Descripción |
|---------|-------------|
| `pnpm docker:dev` | Levanta postgres + backend + frontend en Docker |
| `pnpm dev` | Postgres en Docker, backend y frontend en local |
| `pnpm stop` | Para los contenedores |
| `pnpm clean` | Para y borra volúmenes |
| `pnpm build` | Build de todos los packages |
| `pnpm test` | Tests en todos los packages |
| `pnpm prisma:migrate` | Ejecuta migraciones de BD |
| `pnpm prisma:studio` | Abre Prisma Studio |

## URLs en desarrollo

| Servicio | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

## Estructura del monorepo

```
CV-Generator/
├── backend/          # API Node.js (arquitectura hexagonal)
│   ├── src/
│   │   ├── domain/       # Entidades, repositorios, casos de uso
│   │   ├── application/  # Controladores, rutas, middlewares
│   │   └── infrastructure/ # BD, servicios externos
│   └── prisma/       # Schema y migraciones
├── frontend/         # SPA React + Vite
│   └── src/
│       ├── components/   # UI, CV editor, auth
│       ├── pages/
│       ├── services/
│       ├── store/        # Zustand
│       └── i18n/         # Traducciones ES/EN
├── docker-compose.dev.yml
├── scripts/
└── docs/
```

## Seguridad

- `.env` está ignorado en `.gitignore`.
- Pre-commit hook con escaneo de secretos (`scripts/check-secrets.sh`).
- No subas API keys reales al repositorio.

## Licencia

MIT — revisa `LICENSE`.
# Deploy test
# Test deploy
