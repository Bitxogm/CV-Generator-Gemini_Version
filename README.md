# CV Crafter - Generador de CV con IA

<div align="center">

**Un generador de CV profesional potenciado por Google Gemini 2.5 Flash**

[Características](#características) • [Instalación](#instalación) • [Uso](#uso) • [Tecnologías](#tecnologías)

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5--Flash-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🎯 Descripción

CV Crafter es una aplicación web moderna y **sin servidor** que utiliza la API de **Google Gemini 2.5-flash** directamente desde el cliente para ayudarte a crear, optimizar y personalizar currículums profesionales. 

Con **persistencia local mediante localStorage**, auto-guardado automático, y análisis de IA en tiempo real, puedes crear CVs profesionales sin necesidad de crear cuentas o depender de servicios externos.

## ✨ Características

### 📝 Gestión de CV

- ✅ **Editor completo** con secciones personalizables:
  - 👤 Información personal y contacto
  - 📄 Resumen profesional
  - 💼 Experiencia laboral
  - 🎓 Educación
  - 🛠️ Habilidades técnicas y blandas
  - 🚀 Proyectos destacados
  - 🌍 Idiomas

- 💾 **Auto-guardado automático** - Tus cambios se guardan cada 2 segundos
- 📚 **Historial de versiones** - Guarda hasta 10 versiones con nombre
- 📥 **Exportar/Importar** - Descarga backups en JSON
- 🎨 **3 plantillas profesionales**:
  - 🎨 Moderna (diseño contemporáneo)
  - 📋 Profesional (formato tradicional)  
  - 🌈 Creativa (visualmente mejorada)

### 🤖 Funcionalidades con IA (Gemini 2.5 Flash)

#### 🎯 Adaptación Inteligente de CV
- Analiza tu CV contra descripciones de trabajo específicas
- Proporciona **puntuación de compatibilidad** (0-100)
- Identifica **habilidades coincidentes y faltantes**
- Genera **resumen optimizado** para la oferta
- Ofrece **recomendaciones personalizadas**

#### ✉️ Generación de Cartas de Presentación
- Genera cartas profesionales basadas en tu CV y la oferta
- Optimizadas para **una página A4** (350-450 palabras)
- Soporte **bilingüe** (español e inglés)
- **Editable** antes de descargar
- **Dos formatos** de exportación: Minimal y Formal

#### 📊 Análisis ATS
- Evalúa compatibilidad con **Applicant Tracking Systems**
- Proporciona **puntuación ATS** detallada
- Identifica **palabras clave** presentes y faltantes
- Ofrece **sugerencias de mejora** específicas
- Detecta **fortalezas y debilidades**

#### 🚀 Mejora Automática
- Generación de **resúmenes profesionales** optimizados
- Mejora de descripciones con **verbos de acción**
- Incorporación de **métricas cuantificables**

### 📄 Exportación y Descarga

- 📄 **PDF Visual** - CVs estilizados con las plantillas seleccionadas
- 🤖 **PDF ATS** - Versión optimizada para parsing automático
- 📬 **Cartas en PDF** - Formatos minimal y formal
- 💾 **Backup JSON** - Exporta todos tus datos

### 🎨 Otros

- 🌍 **Soporte multiidioma** - Español e inglés (react-i18next)
- 📱 **Diseño responsive** - Funciona en todos los dispositivos
- 🎉 **Feedback visual** - Notificaciones toast y animaciones
- 🔒 **100% privado** - Todos los datos en tu navegador
- ⚡ **Súper rápido** - Sin latencia de red

---

## 🛠️ Tecnologías

### Frontend
- **Vite** 5.4.19 - Build tool ultra-rápido
- **React** 18.3.1 - Biblioteca UI
- **TypeScript** 5.8.3 - Tipado estático
- **Tailwind CSS** 3.4.17 - Framework CSS utility-first
- **shadcn/ui** - Componentes UI (Radix UI)
- **React Router** 6.30.1 - Enrutamiento SPA
- **React Hook Form** 7.61.1 - Gestión de formularios
- **Zod** 3.25.76 - Validación de esquemas

### IA & APIs
- **Google Gemini API** 2.5-flash - Inteligencia artificial
- **@google/generative-ai** - Cliente oficial de Gemini

### Persistencia
- **localStorage** - Almacenamiento local del navegador
- **JSON** - Formato de datos

### Generación de PDFs
- **@react-pdf/renderer** 4.3.1 - PDFs en React
- **jsPDF** 3.0.3 - Generación de PDFs de cartas

### UI/UX
- **Lucide React** - Sistema de iconos
- **Sonner** - Notificaciones toast elegantes
- **canvas-confetti** - Animaciones de celebración
- **react-i18next** - Internacionalización
- **next-themes** - Gestión de temas claro/oscuro

---

## 📋 Requisitos Previos

- **Node.js** 18+ y npm
- **API Key de Google Gemini** ([Obtener gratis aquí](https://ai.google.dev/))

---

## 🚀 Instalación

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
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

**¿Dónde obtener tu API key?**
1. Ve a [Google AI Studio](https://ai.google.dev/)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Cópiala al archivo `.env`

### 4. Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080` 🎉

---

## 📖 Uso

### Creación de CV

1. **Completa tu información** en las secciones del formulario
2. **Auto-guardado** - Tus cambios se guardan automáticamente cada 2 segundos
3. **Vista previa** - Haz clic en "Vista previa" para ver tu CV
4. **Selecciona plantilla** - Elige entre Moderna, Profesional o Creativa
5. **Descarga** - Exporta en formato PDF visual o ATS

### Adaptación con IA

1. Ve a la pestaña **"Asistente IA"**
2. Pega la **descripción del trabajo**
3. Haz clic en **"Adaptar CV"**
4. Revisa el **análisis de compatibilidad**
5. Aplica las **sugerencias automáticas**

### Generación de Carta de Presentación

1. En **"Asistente IA"**, pega la descripción del trabajo
2. Haz clic en **"Generar Carta"**
3. **Edita** el contenido si lo deseas
4. **Descarga** en formato Minimal o Formal

### Análisis ATS

1. Ve a **Vista previa → pestaña ATS**
2. Haz clic en **"Analizar con IA"**
3. Revisa la **puntuación** y sugerencias
4. Descarga **PDF optimizado para ATS**

### Gestión de Versiones

1. Haz clic en el botón **"Guardar"**
2. Ponle un **nombre** a la versión (ej: "CV para Google")
3. Accede al **historial** con el botón "Historial"
4. **Carga** versiones anteriores cuando las necesites

### Backup de Datos

```javascript
// Desde la consola del navegador (F12):
// Exportar todos los datos
const backup = localStorage.getItem('cv_generator_data');
console.log(backup);

// O usa el botón "Exportar Todo" en la UI (si lo implementas)
```

---

## 📁 Estructura del Proyecto

```
CV-Generator-Gemini_Version/
├── src/
│   ├── components/          # Componentes React
│   │   ├── cv/             # Componentes de CV
│   │   │   ├── pdf/        # Plantillas PDF
│   │   │   ├── preview/    # Plantillas de vista previa
│   │   │   ├── sections/   # Secciones del formulario
│   │   │   ├── AIAssistant.tsx  # Asistente IA
│   │   │   └── CVForm.tsx       # Formulario principal
│   │   ├── ui/             # Componentes shadcn/ui
│   │   └── LanguageSelector.tsx # Selector de idioma
│   ├── contexts/           # Contextos de React
│   │   └── LanguageContext.tsx  # Contexto de idioma
│   ├── hooks/              # React hooks personalizados
│   │   └── useAutoSave.ts       # Hook de auto-guardado
│   ├── services/           # Servicios
│   │   ├── geminiService.ts     # Servicio de Gemini AI
│   │   └── storageService.ts    # Servicio de localStorage
│   ├── pages/              # Páginas de la aplicación
│   │   └── Index.tsx            # Página principal
│   ├── types/              # Definiciones TypeScript
│   │   └── cv.ts                # Tipos del CV
│   ├── lib/                # Utilidades
│   │   ├── confetti.ts          # Animaciones
│   │   └── i18n.ts              # Configuración i18n
│   └── utils/              # Funciones auxiliares
├── public/                 # Archivos estáticos
│   └── locales/           # Traducciones
│       ├── es/            # Español
│       └── en/            # Inglés
├── .env                    # Variables de entorno
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔑 API de Google Gemini

Este proyecto utiliza **Gemini 2.5-flash** directamente desde el cliente:

### Configuración
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

### Funciones que usan Gemini
1. **Adaptación de CV** - Análisis y optimización según ofertas
2. **Generación de cartas** - Cartas de presentación personalizadas
3. **Análisis ATS** - Evaluación de compatibilidad
4. **Generación de resumen** - Resúmenes profesionales optimizados

### Parámetros
- **Model:** gemini-2.5-flash
- **Temperature:** 0.7
- **Max tokens:** Variable según función
- **Response format:** JSON estructurado

### Límites (Free Tier)
- ✅ 15 requests/minuto
- ✅ 1,500 requests/día
- ✅ 1 millón de tokens/mes

**Suficiente para uso personal** 🎉

---

## 💾 Almacenamiento de Datos

### localStorage

Todos los datos se guardan en tu navegador usando `localStorage`:

```javascript
// Estructura de datos
{
  "cv_generator_data": {         // CV actual
    "personalInfo": {...},
    "summary": "...",
    "experience": [...],
    // ...
  },
  "cv_generator_history": [      // Historial (últimas 10)
    {
      "id": "1699999999999",
      "name": "CV para Google",
      "data": {...},
      "createdAt": "2024-11-12T10:30:00Z"
    }
  ],
  "cv_generator_cover_letters": [  // Cartas (últimas 20)
    {
      "id": "1699999999999",
      "jobTitle": "Senior Developer",
      "content": "...",
      "createdAt": "2024-11-12T10:35:00Z"
    }
  ],
  "cv_generator_settings": {}     // Configuración
}
```

### Capacidad
- **Límite típico:** 5-10 MB por dominio
- **Espacio usado:** ~100-500 KB (dependiendo del contenido)
- **CVs almacenables:** ~50-100 versiones completas

### Backup Manual
```bash
# Exportar desde consola del navegador (F12)
const data = {
  cvData: localStorage.getItem('cv_generator_data'),
  history: localStorage.getItem('cv_generator_history'),
  letters: localStorage.getItem('cv_generator_cover_letters')
};
console.log(JSON.stringify(data, null, 2));
```

---

## 🚀 Despliegue

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard:
# Settings → Environment Variables
# VITE_GEMINI_API_KEY = tu_api_key
```

**URL de ejemplo:** `https://tu-proyecto.vercel.app`

### Opción 2: Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Configurar variables:
# Site settings → Build & deploy → Environment
```

### Opción 3: GitHub Pages

```bash
# Configurar vite.config.ts:
export default defineConfig({
  base: '/CV-Generator-Gemini_Version/',
  // ...
})

# Build
npm run build

# Subir carpeta dist/ a GitHub Pages
```

### Variables de Entorno en Producción

**Importante:** No subas tu `.env` a GitHub. En producción:

1. **Vercel/Netlify:** Usa el dashboard para agregar `VITE_GEMINI_API_KEY`
2. **Otras plataformas:** Consulta su documentación sobre variables de entorno

---

## 📜 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 8080)
npm run build        # Compilar para producción
npm run preview      # Vista previa de build de producción
npm run lint         # Ejecutar ESLint
```

---

## 🔒 Seguridad & Privacidad

### ✅ Características de Seguridad

- **Sin backend** - No hay servidor que hackear
- **Sin base de datos** - Tus datos nunca salen de tu navegador
- **Sin autenticación** - No necesitas crear cuentas
- **API Key protegida** - Usa variables de entorno (nunca en el código)
- **HTTPS en producción** - Comunicación encriptada con Gemini API

### ⚠️ Consideraciones

1. **Datos en localStorage:**
   - Los datos persisten en el navegador
   - Si borras caché/cookies, pierdes los datos
   - **Solución:** Exporta backups regularmente

2. **API Key en producción:**
   - La API key es accesible desde el cliente
   - **Para uso personal:** Está bien
   - **Para app pública:** Considera usar un proxy/backend

3. **Límites de Gemini:**
   - 15 requests/minuto (suficiente para uso personal)
   - Si compartes la app públicamente, considera rate limiting

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! 

### Cómo contribuir:

1. **Fork** el proyecto
2. Crea tu **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la branch (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Áreas de mejora:

- [ ] Más plantillas de CV
- [ ] Exportación a Word (.docx)
- [ ] Integración con LinkedIn
- [ ] Modo oscuro completo
- [ ] Más idiomas (francés, alemán, etc.)
- [ ] Análisis de compatibilidad con múltiples ofertas
- [ ] Sugerencias en tiempo real mientras escribes

---

## 🐛 Reportar Problemas

Si encuentras un bug o tienes una sugerencia:

1. Ve a [Issues](https://github.com/Bitxogm/CV-Generator-Gemini_Version/issues)
2. Busca si ya existe un issue similar
3. Si no, crea uno nuevo con:
   - Descripción detallada
   - Pasos para reproducir
   - Capturas de pantalla
   - Versión del navegador

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

Esto significa que puedes:
- ✅ Usar comercialmente
- ✅ Modificar el código
- ✅ Distribuir
- ✅ Uso privado

Siempre que incluyas el aviso de copyright y licencia.

---

## 🙏 Agradecimientos

- **Google Gemini AI** - Por proporcionar una API de IA potente y gratuita
- **shadcn/ui** - Por los componentes UI hermosos
- **Lovable.dev** - Por facilitar el desarrollo inicial
- **Comunidad Open Source** - Por todas las librerías increíbles

---

## 📞 Contacto

**Victor Manuel González Moreno**

- GitHub: [@Bitxogm](https://github.com/Bitxogm)
- LinkedIn: [Victor Manuel González Moreno](https://www.linkedin.com/in/victor-manuel-gonzalez-moreno/)
- Email: vmmoreno1999@gmail.com
- Portfolio: [myreactportfolio1944.web.app](https://myreactportfolio1944.web.app/)

---

## 🌟 Roadmap Futuro

### Versión 2.0 (Próximamente)
- [ ] Modo offline completo (PWA)
- [ ] Sincronización opcional con MongoDB
- [ ] Editor de plantillas personalizado
- [ ] Más modelos de IA (Claude, GPT-4)
- [ ] Análisis de múltiples ofertas simultáneas
- [ ] Estadísticas de aplicaciones
- [ ] Panel de seguimiento de candidaturas

### Versión 3.0 (A largo plazo)
- [ ] App móvil nativa
- [ ] Integración con job boards (LinkedIn, Indeed)
- [ ] Análisis predictivo de éxito
- [ ] Red social para compartir templates
- [ ] Marketplace de plantillas

---

<div align="center">

**Hecho con ❤️ usando React, TypeScript y Google Gemini 2.5 Flash**

**Sin Supabase, sin backend, sin complicaciones** ✨

[⬆ Volver arriba](#cv-crafter---generador-de-cv-con-ia)

**⭐ Si te gusta el proyecto, dale una estrella en GitHub!**

</div>