# Contribuir a TalentHub

---

## Cómo contribuir

### Reportar bugs

1. Busca si ya existe el issue en [GitHub Issues](https://github.com/Bitxogm/CV-Generator-Gemini_Version/issues)
2. Si no existe, abre uno nuevo con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Versión de Node.js, OS y navegador

### Proponer features

Abre un issue con label `enhancement` explicando:
- Qué problema resuelve
- Cómo lo implementarías
- Alternativas que consideraste

### Pull Requests

```bash
# Fork y clonar
git clone https://github.com/TU-USUARIO/CV-Generator-Gemini_Version.git
cd CV-Generator-Gemini_Version

# Instalar
pnpm install
docker-compose up -d
cd backend && pnpm prisma migrate dev

# Crear rama
git checkout -b feature/nombre-feature

# Desarrollar, luego
git push origin feature/nombre-feature
# Abrir PR contra main
```

---

## Estándares

### Commits — Conventional Commits

```
feat: add LinkedIn profile import
fix: resolve JWT expiration on refresh
docs: update ARCHITECTURE.md
test: add unit tests for AdaptCVUseCase
refactor: extract PDF renderer to shared service
chore: bump Prisma to 5.23
```

### TypeScript

- Sin `any` — usar tipos explícitos o `unknown`
- Interfaces para contratos de datos, tipos para uniones/aliases
- Nombres descriptivos; sin abreviaciones crípticas

### Tests

- Nuevas features deben incluir tests unitarios
- Bugs deben incluir test de regresión
- Ejecutar antes de abrir PR:

```bash
# Backend
cd backend && pnpm test

# Frontend
cd frontend && pnpm test:unit && pnpm exec playwright test
```

### Linting

```bash
# Desde la raíz
pnpm lint
pnpm format
```

---

## Arquitectura

Antes de contribuir, leer [ARCHITECTURE.md](ARCHITECTURE.md):

- **Backend**: Clean Architecture — lógica de negocio en `domain/`, HTTP en `application/`, implementaciones en `infrastructure/`
- **Frontend**: Feature-Sliced Design — cada feature es autónoma, imports solo hacia abajo en la jerarquía

---

## Proceso de review

1. El PR debe pasar todos los checks de CI
2. Al menos un approval antes de merge
3. No hacer squash de commits descriptivos
4. Resolver todos los comentarios antes de merge

---

## Contacto

**Issues**: https://github.com/Bitxogm/CV-Generator-Gemini_Version/issues
