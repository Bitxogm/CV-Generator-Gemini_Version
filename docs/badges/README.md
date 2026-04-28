# Coverage Badges

Referencia de badges usados en README.md y cómo actualizarlos.

---

## Backend

**Coverage actual**: 56.33% — 19 tests

![Backend Coverage](https://img.shields.io/badge/coverage-56.33%25-yellow)

```bash
cd backend
pnpm test:coverage
# El resultado imprime el % — actualizar el badge en README.md con el nuevo valor
```

Badge URL: `https://img.shields.io/badge/coverage-56.33%25-yellow`

---

## Frontend

**Coverage actual**: 84-95% en módulos críticos — 70 tests

![Frontend Coverage](https://img.shields.io/badge/coverage-84--95%25-brightgreen)

```bash
cd frontend
pnpm test:coverage
pnpm exec playwright test
```

Badge URL: `https://img.shields.io/badge/coverage-84--95%25-brightgreen`

---

## Tests totales

Backend: 19 | Frontend: 70 | **Total: 89 tests**

![Tests](https://img.shields.io/badge/tests-89%20passing-success)

---

## Colores de referencia shields.io

| Rango | Color |
|-------|-------|
| >= 90% | `brightgreen` |
| >= 75% | `green` |
| >= 60% | `yellow` |
| >= 40% | `orange` |
| < 40% | `red` |

---

## Cómo actualizar un badge

Los badges en README.md son URLs estáticas. Al mejorar la cobertura:

1. Ejecutar `pnpm test:coverage` en el package correspondiente
2. Anotar el nuevo porcentaje
3. Editar `README.md` y reemplazar el valor en la URL del badge
4. Commit: `docs: update coverage badge to XX%`
