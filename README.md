# CV Crafter - Generador de CV con IA

<div align="center">

**Un generador de CV profesional potenciado por Google Gemini AI**

[Características](#características) • [Instalación](#instalación) • [Uso](#uso) • [Tecnologías](#tecnologías)

</div>

---

## Descripción

CV Crafter es una aplicación web moderna que utiliza la API de **Google Gemini 2.0-flash** para ayudar a los usuarios a crear, optimizar y personalizar currículums profesionales. La aplicación ofrece análisis ATS, adaptación de CV según ofertas de trabajo, generación de cartas de presentación y múltiples plantillas de exportación.

## Características

### Gestión de CV
- ✅ **Editor completo de CV** con secciones personalizables:
  - Información personal y contacto
  - Resumen profesional
  - Experiencia laboral
  - Educación
  - Habilidades técnicas
  - Proyectos destacados
  - Idiomas

- 💾 **Guardado múltiple** - Gestiona diferentes versiones de tu CV
- 📚 **Historial** - Accede a CVs guardados previamente
- 🎨 **3 plantillas profesionales**:
  - Moderna (diseño contemporáneo)
  - Profesional (formato tradicional)
  - Creativa (visualmente mejorada)

### Funcionalidades con IA (Gemini)

#### 🎯 Adaptación de CV
- Analiza tu CV contra descripciones de trabajo específicas
- Proporciona puntuación de compatibilidad (0-100)
- Identifica habilidades coincidentes y faltantes
- Genera resumen optimizado para la oferta
- Ofrece recomendaciones personalizadas

#### ✉️ Generación de Cartas de Presentación
- Genera cartas profesionales basadas en tu CV y la oferta de trabajo
- Optimizadas para una página A4 (350-450 palabras)
- Soporte bilingüe (español e inglés)
- Editable antes de descargar
- Dos formatos de exportación: Minimal y Formal

#### 📊 Análisis ATS
- Evalúa compatibilidad con sistemas de seguimiento de candidatos
- Proporciona puntuación ATS
- Identifica palabras clave presentes y faltantes
- Ofrece sugerencias de mejora
- Detecta fortalezas y debilidades

#### 🚀 Mejora con IA
- Generación de resúmenes profesionales optimizados
- Mejora de descripciones de puestos y proyectos
- Uso de verbos de acción y métricas cuantificables

### Exportación y Descarga

- 📄 **PDF Visual** - CVs estilizados con las plantillas seleccionadas
- 🤖 **PDF ATS** - Versión optimizada para parsing automático
- 📬 **Cartas en PDF** - Formatos minimal y formal

### Otros

- 🌍 **Soporte multiidioma** - Español e inglés
- 🔐 **Autenticación segura** - Sistema de usuarios con Supabase Auth
- 📱 **Diseño responsive** - Funciona en todos los dispositivos
- 🎉 **Feedback visual** - Notificaciones y animaciones

## Tecnologías

### Frontend
- **Vite** 5.4.19 - Build tool y servidor de desarrollo
- **React** 18.3.1 - Biblioteca UI
- **TypeScript** 5.8.3 - Tipado estático
- **Tailwind CSS** 3.4.17 - Framework CSS
- **shadcn/ui** - Componentes UI (Radix UI)
- **React Router** 6.30.1 - Enrutamiento
- **React Hook Form** 7.61.1 - Gestión de formularios
- **TanStack Query** 5.83.0 - Gestión de estado del servidor
- **Zod** 3.25.76 - Validación de esquemas

### Backend & Base de Datos
- **Supabase** - Base de datos PostgreSQL y autenticación
- **Supabase Edge Functions** - Funciones serverless
- **Google Gemini API** (2.0-flash) - Inteligencia artificial

### Generación de PDFs
- **@react-pdf/renderer** 4.3.1 - Generación de PDFs en React
- **jsPDF** 3.0.3 - Biblioteca PDF para cartas

### UI/UX
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast
- **canvas-confetti** - Animaciones de celebración
- **Recharts** - Gráficos
- **next-themes** - Gestión de temas

## Requisitos Previos

- **Node.js** 18+ y npm/yarn/pnpm
- **Cuenta de Supabase** (gratuita)
- **API Key de Google Gemini** ([Obtener aquí](https://ai.google.dev/))
- **Supabase CLI** (para funciones edge)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Bitxogm/CV-Generator-Gemini_Version.git
cd CV-Generator-Gemini_Version
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=tu_supabase_anon_key
```

### 4. Configurar Supabase

#### a) Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la URL y la Anon Key a tu `.env`

#### b) Ejecutar migraciones
```bash
# Instalar Supabase CLI si no lo tienes
npm install -g supabase

# Iniciar sesión
supabase login

# Vincular proyecto
supabase link --project-ref tu_project_id

# Ejecutar migraciones
supabase db push
```

#### c) Desplegar funciones Edge
```bash
# Configurar secretos
supabase secrets set GEMINI_API_KEY=tu_gemini_api_key
supabase secrets set LOVABLE_API_KEY=tu_lovable_api_key  # Opcional

# Desplegar todas las funciones
supabase functions deploy adapt-cv
supabase functions deploy generate-cover-letter
supabase functions deploy analyze-ats
supabase functions deploy generate-summary
supabase functions deploy enhance-description
```

### 5. Configurar Git Hooks (Seguridad)

```bash
chmod +x scripts/setup-hooks.sh
./scripts/setup-hooks.sh
```

Esto configurará un hook pre-commit que detecta credenciales expuestas.

## Uso

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

### Construcción para producción

```bash
npm run build
```

### Vista previa de producción

```bash
npm run preview
```

## Estructura del Proyecto

```
CV-Generator-Gemini_Version/
├── src/
│   ├── components/          # Componentes React
│   │   ├── auth/           # Autenticación
│   │   ├── cv/             # Componentes de CV
│   │   │   ├── pdf/        # Plantillas PDF
│   │   │   ├── preview/    # Plantillas de vista previa
│   │   │   └── sections/   # Secciones del formulario
│   │   └── ui/             # Componentes shadcn/ui
│   ├── hooks/              # React hooks personalizados
│   ├── pages/              # Páginas de la aplicación
│   ├── types/              # Definiciones TypeScript
│   ├── lib/                # Utilidades
│   ├── utils/              # Funciones auxiliares
│   └── integrations/       # Integraciones externas
│       └── supabase/       # Cliente Supabase
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── adapt-cv/
│   │   ├── analyze-ats/
│   │   ├── generate-summary/
│   │   ├── enhance-description/
│   │   └── generate-cover-letter/
│   ├── migrations/         # Migraciones de BD
│   └── config.toml         # Configuración Supabase
├── public/                 # Archivos estáticos
├── scripts/                # Scripts de utilidad
└── package.json
```

## API de Google Gemini

Este proyecto utiliza **Gemini 2.0-flash-exp** para todas las funcionalidades de IA:

### Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
```

### Funciones que usan Gemini
1. **adapt-cv** - Adaptación de CV según ofertas
2. **generate-cover-letter** - Generación de cartas de presentación

### Configuración
- Temperature: 0.7
- Max tokens: 800-1500 según función
- Formato de respuesta: JSON estructurado

## Base de Datos

### Tablas

#### `profiles`
```sql
- id (uuid, PK)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `cvs`
```sql
- id (uuid, PK)
- user_id (uuid, FK → profiles)
- cv_data (jsonb)
- template_type (text)
- cv_name (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Políticas RLS
- Los usuarios solo pueden leer/escribir sus propios datos
- Autenticación requerida para todas las operaciones

## Despliegue

### Opción 1: Vercel
```bash
npm install -g vercel
vercel
```

### Opción 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Opción 3: Hosting tradicional
```bash
npm run build
# Subir la carpeta dist/ a tu servidor
```

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Vista previa de build
npm run lint         # Ejecutar ESLint
```

## Seguridad

- ✅ Git hooks para detectar credenciales expuestas
- ✅ Variables de entorno para secretos
- ✅ Row-Level Security (RLS) en Supabase
- ✅ Autenticación JWT
- ✅ HTTPS en producción

## Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Roadmap

- [ ] Más plantillas de CV
- [ ] Exportación a Word (.docx)
- [ ] Integración con LinkedIn
- [ ] Análisis de compatibilidad con múltiples ofertas
- [ ] Sugerencias de mejora en tiempo real
- [ ] Modo oscuro completo
- [ ] Panel de estadísticas de aplicaciones

## Soporte

Si encuentras algún problema o tienes sugerencias:

1. Abre un [Issue](https://github.com/Bitxogm/CV-Generator-Gemini_Version/issues)
2. Describe el problema detalladamente
3. Incluye capturas de pantalla si es posible

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Hecho con ❤️ usando React, TypeScript y Google Gemini AI**

[⬆ Volver arriba](#cv-crafter---generador-de-cv-con-ia)

</div>
