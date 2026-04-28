<div align="center">

# TalentHub

**Marketplace de Perfiles Profesionales con IA**

[![Build Status](https://img.shields.io/github/actions/workflow/status/Bitxogm/CV-Generator-Gemini_Version/deploy.yml?branch=main)](https://github.com/Bitxogm/CV-Generator-Gemini_Version/actions)
[![Coverage](https://img.shields.io/badge/coverage-84%25-brightgreen)](https://github.com/Bitxogm/CV-Generator-Gemini_Version)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)

[Demo](https://talent.bitxodev.com) · [Instalación detallada](INSTALL.md) · [Deploy](DEPLOYMENT.md)

</div>

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Arquitectura](#arquitectura)
- [Instalación Rápida](#instalación-rápida)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

---

## Descripción

TalentHub es una plataforma completa para crear, gestionar y optimizar CVs profesionales con asistencia de Inteligencia Artificial. Utiliza Gemini 2.5 Flash para adaptar CVs a ofertas específicas, generar cartas de presentación personalizadas y analizar compatibilidad con sistemas ATS.

**Por qué TalentHub:**

- **IA Generativa**: Adaptación automática de CVs a ofertas laborales
- **Optimización ATS**: Análisis y scoring para sistemas de tracking
- **Multi-formato**: Exportación PDF visual y ATS-friendly
- **Arquitectura Profesional**: Clean Architecture (backend) + Feature-Sliced Design (frontend)
- **Testing Completo**: 89 tests (E2E + Unit) con alta cobertura en módulos críticos
- **Producción**: CI/CD automatizado + VPS Hetzner + Docker

---

## Características

### Asistente IA (Gemini 2.5 Flash)

- **Adaptación de CV**: Ajusta automáticamente el contenido a ofertas específicas
- **Carta de Presentación**: Generación personalizada basada en CV + oferta
- **Análisis ATS**: Scoring, keywords detectados y sugerencias de mejora
- **Extracción de Ofertas**: Parsing automático desde URLs

### Gestión de CVs

- **Editor Multi-sección**: Datos personales, resumen, experiencia, educación, skills, proyectos, idiomas
- **4 Plantillas Profesionales**: Modern, Professional, Creative, ATS
- **Doble Exportación PDF**:
  - Visual: Diseño atractivo con `@react-pdf/renderer`
  - ATS: Optimizado para parsing con `jsPDF`
- **Historial**: CRUD completo de CVs guardados
- **Auto-save**: Persistencia automática en localStorage

### Internacionalización y UX

- Soporte completo ES/EN con `react-i18next`
- Cambio de idioma en tiempo real
- Dark mode con persistencia

### Autenticación

- JWT con tokens seguros
- Bcrypt para hashing de contraseñas
- Rutas protegidas con React Router

---

## Screenshots

### Dashboard Principal
![Dashboard](docs/screenshots/dashboard.png)

### Editor de CV
![Editor](docs/screenshots/editor.png)

### Asistente IA
![AI Assistant](docs/screenshots/ai-assistant.png)

### Preview PDF
![Preview](docs/screenshots/preview.png)

---

## Tech Stack

### Backend

| Tecnología | Versión | Rol |
|------------|---------|-----|
| Node.js | 20 | Runtime |
| TypeScript | 5.3 | Tipado estático |
| Express | 4.18 | Framework web |
| Prisma | 5.22 | ORM |
| PostgreSQL | 16 | Base de datos |
| Gemini | 2.5 Flash | IA Generativa |
| Vitest | 2.1 | Testing |

Arquitectura: **Clean Architecture** (Application / Domain / Infrastructure)

### Frontend

| Tecnología | Versión | Rol |
|------------|---------|-----|
| React | 18 | Framework UI |
| TypeScript | 5.3 | Tipado estático |
| Vite | 5.4 | Build tool |
| Tailwind CSS | 3.4 | Estilos |
| shadcn/ui | latest | Componentes |
| Zustand | 4.5 | Estado global |
| TanStack Query | 5 | Server state |
| Vitest + Playwright | 2.1 / 1.59 | Testing |

Arquitectura: **Feature-Sliced Design (FSD)**

### DevOps

| Tecnología | Rol |
|------------|-----|
| Docker + Docker Compose | Contenedores |
| GitHub Actions | CI/CD |
| Nginx Proxy Manager | Reverse proxy |
| Hetzner VPS (Ubuntu 24.04) | Producción |

---

## Arquitectura

### Backend: Clean Architecture

```
backend/src/
├── application/        # Casos de uso, servicios de aplicación
├── domain/             # Entidades, repositorios (interfaces), lógica de negocio
└── infrastructure/     # Implementaciones: BD, HTTP, servicios externos
    ├── database/       # Prisma, repositorios concretos
    ├── http/           # Controladores, rutas, middlewares
    └── external/       # Gemini API, SMTP
```

### Frontend: Feature-Sliced Design

```
frontend/src/
├── app/        # Inicialización, providers, router
├── pages/      # Composición de rutas
├── widgets/    # Bloques UI complejos (CVDashboard, AIAssistant)
├── features/   # Casos de uso (auth/login, auth/register, cv/export)
├── entities/   # Modelos de negocio (user, cv)
└── shared/     # UI base, utils, i18n, hooks reutilizables
```

---

## Instalación Rápida

**Requisitos**: Node.js >= 20, pnpm >= 9, Docker + Docker Compose

```bash
git clone https://github.com/Bitxogm/CV-Generator-Gemini_Version.git
cd CV-Generator-Gemini_Version

# Variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Editar backend/.env:
#   DATABASE_URL=postgresql://...
#   JWT_SECRET=<secret_seguro>
#   GEMINI_API_KEY=<tu_api_key>

# Instalar dependencias
pnpm install

# Levantar servicios (PostgreSQL + backend + frontend)
pnpm docker:dev
```

Visita [http://localhost:8080](http://localhost:8080)

Ver [INSTALL.md](INSTALL.md) para configuración detallada y opciones de arranque.

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm docker:dev` | Levanta PostgreSQL + backend + frontend en Docker |
| `pnpm dev` | PostgreSQL en Docker, backend y frontend en local |
| `pnpm stop` | Para los contenedores |
| `pnpm clean` | Para y borra volúmenes |
| `pnpm build` | Build de todos los packages |
| `pnpm test` | Tests en todos los packages |
| `pnpm prisma:migrate` | Ejecuta migraciones de BD |
| `pnpm prisma:studio` | Abre Prisma Studio |

**URLs en desarrollo:**

| Servicio | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

---

## Testing

### Backend

```bash
cd backend
pnpm test           # Ejecutar tests
pnpm test:coverage  # Con coverage
```

**Resultados**: 19 tests | 56.33% coverage global

### Frontend

```bash
cd frontend
pnpm test:unit                  # Tests unitarios (Vitest)
pnpm exec playwright test       # Tests E2E (Playwright)
pnpm test:coverage              # Coverage completo
```

**Resultados**: 70 tests | 84-95% coverage en módulos críticos

---

## Deployment

La aplicación se despliega automáticamente en cada push a `main` mediante GitHub Actions.

```bash
# Build y arranque en producción
docker-compose -f docker-compose.prod.yml up -d
```

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para la guía completa.

**Producción**: [https://talent.bitxodev.com](https://talent.bitxodev.com)

---

## Roadmap

- [ ] Recuperación de contraseña por email
- [ ] Compartir CVs públicamente (link único)
- [ ] Plantillas personalizables con editor visual
- [ ] Integración con LinkedIn API
- [ ] Soporte multi-idioma (FR, DE, IT)
- [ ] Analytics de vistas de CV
- [ ] Exportación Word / LaTeX

---

## Licencia

MIT — ver [LICENSE](LICENSE).

---

<div align="center">

**Víctor** · [@bitxodev](https://github.com/Bitxogm) · Proyecto Final Bootcamp KeepCoding 2025

</div>
