# CV Crafter

Generador de CV profesional con React + TypeScript + Vite, con asistencia de IA (Google Gemini), plantillas visuales y exportación a PDF.

## Qué hace este proyecto

- Editor completo de CV por secciones (datos personales, resumen, experiencia, educación, skills técnicas/blandas, proyectos e idiomas).
- Selector de plantilla visual: `modern`, `professional`, `creative`.
- Vista previa del CV y descarga en PDF:
  - PDF visual por plantilla (`@react-pdf/renderer`)
  - PDF ATS optimizado (`ATSPDF`)
- Asistente IA (Gemini 2.5 Flash):
  - Adaptación de CV a una oferta
  - Puntuación de compatibilidad
  - Generación de carta de presentación
  - Análisis ATS con score y sugerencias
- Carta de presentación en PDF (`minimal` o `formal`) con vista previa (`jsPDF`).
- Persistencia local en navegador (`localStorage`):
  - autoguardado de CV
  - historial de versiones
  - almacenamiento de cartas
- Internacionalización ES/EN (`react-i18next`).

## Stack técnico

- `React 18` + `TypeScript`
- `Vite 5` (puerto `8080`)
- `Tailwind CSS` + `shadcn/ui` + `Radix UI`
- `@google/generative-ai`
- `@react-pdf/renderer` y `jspdf`
- `react-router-dom`, `@tanstack/react-query`, `sonner`

## Requisitos

- `Node.js 18+`
- `npm` (recomendado en este proyecto)
- API key de Google Gemini

## Variables de entorno

Este proyecto usa variables `VITE_` (se inyectan en frontend en build time):

- `VITE_GEMINI_API_KEY`: API key de Gemini para funcionalidades de IA.

### Configuración rápida

1. Copia el ejemplo:

```bash
cp .env.example .env
```

2. Edita `.env` y añade tu key:

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

> Importante: al ser una app frontend, la key queda expuesta al cliente. Para producción real, considera mover llamadas IA a un backend propio.

## Instalación y ejecución

```bash
npm install
npm run dev
```

App disponible en: `http://localhost:8080`

## Scripts

- `npm run dev` → servidor de desarrollo.
- `npm run build` → build de producción en `dist/`.
- `npm run build:dev` → build modo desarrollo.
- `npm run preview` → previsualiza el build.
- `npm run lint` → lint con ESLint.

## Docker

Hay `Dockerfile` multi-stage (`node:20-alpine` + `nginx:alpine`).

Build con API key:

```bash
docker build \
  --build-arg VITE_GEMINI_API_KEY="tu_api_key" \
  -t cv-crafter:latest .
```

Run:

```bash
docker run --rm -p 8080:80 cv-crafter:latest
```

## Estructura principal

```text
src/
  components/
    cv/
      sections/        # Formulario por secciones
      preview/         # Plantillas visuales de preview
      pdf/             # Plantillas PDF del CV
      AIAssistant.tsx  # IA: adaptación, compatibilidad, carta, ATS
      CVForm.tsx       # Editor principal del CV
  contexts/
    LanguageContext.tsx
  hooks/
    useGeminiCV.ts
  i18n/
    config.ts
    locales/
      es.json
      en.json
  pages/
    Index.tsx          # Pantalla principal (editor + modales)
  services/
    geminiService.ts   # Integración Gemini
    storageService.ts  # localStorage
  utils/
    pdfGenerator.ts    # PDF carta de presentación
```

## Flujo funcional (resumen)

1. Usuario edita datos del CV en `CVForm`.
2. `Index.tsx` mantiene estado global y autoguarda en `StorageService`.
3. En preview se renderiza plantilla y se exporta PDF visual/ATS.
4. En `AIAssistant` se llama a `geminiService` para análisis/adaptación/carta.
5. Cartas se pueden previsualizar y descargar como PDF desde `pdfGenerator.ts`.

## Seguridad y buenas prácticas

- `.env` está ignorado en `.gitignore`.
- Se incluye script de pre-commit para escaneo básico de secretos:
  - `setup-hooks.sh`
  - `scripts/check-secrets.sh`
- No subas tu API key real al repositorio.

## Estado actual

- App SPA sin backend dedicado.
- Datos persistidos localmente en el navegador del usuario.
- Integración Gemini directa desde cliente.

## Licencia

MIT — revisa `LICENSE`.
