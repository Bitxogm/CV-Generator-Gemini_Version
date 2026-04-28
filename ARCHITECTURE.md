# Arquitectura TalentHub

Este documento explica las decisiones arquitectónicas del proyecto y cómo están organizados backend y frontend.

---

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Backend: Clean Architecture](#backend-clean-architecture)
- [Frontend: Feature-Sliced Design](#frontend-feature-sliced-design)
- [Flujos de Datos](#flujos-de-datos)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Referencias](#referencias)

---

## Visión General

TalentHub aplica **separación de responsabilidades** en ambos extremos: el backend sigue Clean Architecture para mantener la lógica de negocio independiente de frameworks y base de datos; el frontend usa Feature-Sliced Design para organizar la UI por dominio funcional en lugar de por tipo de archivo.

### Objetivos Arquitectónicos

- **Mantenibilidad**: Código organizado, fácil de localizar y modificar
- **Testabilidad**: Dependencias invertidas, mocking sencillo sin tocar implementaciones reales
- **Escalabilidad**: Módulos independientes, añadir features no rompe lo existente
- **Independencia**: Lógica de negocio desacoplada de Express, Prisma, React

### Diagrama General

```
┌─────────────────────┐         ┌─────────────────────┐
│     Frontend        │  HTTP   │      Backend        │
│   React + FSD       │◄───────►│  Node.js + Express  │
│   :8080             │         │  :3001              │
└─────────────────────┘         └──────────┬──────────┘
                                            │
                                 ┌──────────▼──────────┐
                                 │    PostgreSQL 16     │
                                 │    (Docker :5432)   │
                                 └──────────┬──────────┘
                                            │
                                 ┌──────────▼──────────┐
                                 │    Gemini 2.5 Flash  │
                                 │    (Google AI API)  │
                                 └─────────────────────┘
```

---

## Backend: Clean Architecture

### Estructura de Capas

```
backend/src/
├── domain/                         # Núcleo de negocio — sin dependencias externas
│   ├── entities/
│   │   ├── CV.ts                  # Entidad CV con métodos de dominio
│   │   ├── User.ts
│   │   └── Profile.ts
│   ├── repositories/              # Interfaces (contratos)
│   │   ├── ICVRepository.ts
│   │   ├── IUserRepository.ts
│   │   └── IProfileRepository.ts
│   ├── use-cases/                 # Lógica de negocio pura
│   │   ├── auth/
│   │   │   ├── SignInUseCase.ts
│   │   │   ├── SignUpUseCase.ts
│   │   │   └── RecoverPasswordUseCase.ts
│   │   └── cv/
│   │       ├── CreateCVUseCase.ts
│   │       ├── UpdateCVUseCase.ts
│   │       ├── DeleteCVUseCase.ts
│   │       ├── AdaptToJobOfferUseCase.ts
│   │       └── GenerateCoverLetterUseCase.ts
│   └── errors/
│       ├── AppError.ts            # Clase base de errores
│       └── errorTypes.ts          # NotFoundError, BadRequestError…
│
├── application/                   # Capa HTTP — adapta requests/responses
│   ├── controllers/
│   │   ├── auth/                  # signup, signin, deleteAccount…
│   │   ├── cv/                    # createCV, updateCV, adaptToJobOffer…
│   │   └── job/                   # extractJobFromUrl
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── cv.routes.ts
│   │   └── job.routes.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts      # Valida JWT
│   │   └── errorHandler.ts        # Mapea AppError → HTTP status
│   └── server.ts
│
└── infrastructure/                # Implementaciones concretas
    ├── database/prisma/
    │   └── PrismaClient.ts        # Singleton del cliente Prisma
    ├── repositories/              # Implementaciones de las interfaces
    │   ├── PrismaCVRepository.ts
    │   ├── PrismaUserRepository.ts
    │   └── PrismaProfileRepository.ts
    └── services/                  # Servicios externos
        ├── GeminiService.ts       # Google Gemini 2.5 Flash
        ├── JWTService.ts
        ├── EmailService.ts        # SMTP / Nodemailer
        └── JobScraperService.ts   # Scraping de URLs de ofertas
```

### Principio 1: Dominio sin dependencias externas

La entidad `CV` no conoce Prisma, Express ni nada externo. Es TypeScript puro:

```typescript
// domain/entities/CV.ts
export class CV {
  public readonly id: string;
  public readonly userId: string;
  public readonly title: string;
  public readonly cvData: CVData;
  public readonly suggestions: Suggestion[];

  constructor(props: CVProps) {
    this.id = props.id;
    this.userId = props.userId;
    // ...
  }

  // Métodos de dominio: retornan nueva instancia (inmutabilidad)
  public addSuggestion(suggestion: Suggestion): CV {
    return new CV({ ...this, suggestions: [...this.suggestions, suggestion] });
  }

  public applyJobOffer(jobOffer: JobOfferData): CV {
    return new CV({ ...this, jobOffer, updatedAt: new Date() });
  }
}
```

### Principio 2: Inversión de dependencias

Los use-cases dependen de interfaces, nunca de implementaciones concretas:

```typescript
// domain/repositories/ICVRepository.ts
export interface ICVRepository {
  findById(id: string): Promise<CV | null>;
  findByUserId(userId: string, filters?: CVFilters): Promise<CV[]>;
  save(cv: CV): Promise<CV>;
  update(id: string, data: Partial<CVProps>): Promise<CV>;
  delete(id: string): Promise<void>;
}

// domain/use-cases/cv/CreateCVUseCase.ts
export class CreateCVUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,   // interfaz, no Prisma
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreateCVDTO): Promise<CV> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) throw new NotFoundError('Usuario');

    const cv = new CV({
      id: uuidv4(),
      userId: dto.userId,
      title: dto.title,
      cvData: dto.cvData,
      suggestions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.cvRepository.save(cv);
  }
}
```

La implementación concreta vive en infrastructure y contiene el único punto donde entra Prisma:

```typescript
// infrastructure/repositories/PrismaCVRepository.ts
export class PrismaCVRepository implements ICVRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Mapper: Prisma record → Domain entity
  private toDomain(prismaCV: PrismaCV): CV {
    return new CV({
      id: prismaCV.id,
      userId: prismaCV.userId,
      cvData: prismaCV.cvData as CVData,
      // ...
    });
  }

  async findById(id: string): Promise<CV | null> {
    const record = await this.prisma.cV.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }
}
```

### Flujo de dependencias

```
┌──────────────────────────────────────────┐
│             Infrastructure               │
│   PrismaCVRepository, GeminiService…     │
│                                          │
│   depende de ↓                           │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│              Application                 │
│   Controllers, Routes, Middlewares       │
│                                          │
│   depende de ↓                           │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│               Domain                     │
│   Entities, Interfaces, Use Cases        │
│                                          │
│   no depende de nada externo             │
└──────────────────────────────────────────┘
```

---

## Frontend: Feature-Sliced Design

### Estructura FSD

```
frontend/src/
├── app/                            # Inicialización
│   ├── App.tsx                    # Componente raíz + router
│   ├── main.tsx                   # Entry point
│   └── providers/
│       └── LanguageProvider.tsx   # i18n context
│
├── pages/                          # Una carpeta por ruta
│   ├── index/ui/IndexPage.tsx     # /
│   ├── login/ui/LoginPage.tsx     # /login
│   ├── register/ui/RegisterPage.tsx
│   └── not-found/ui/NotFoundPage.tsx
│
├── widgets/                        # Bloques UI complejos (combinan features)
│   ├── navbar/ui/Navbar.tsx
│   ├── footer/ui/Footer.tsx
│   └── cv-dashboard/
│       ├── ui/
│       │   ├── CVDashboard.tsx
│       │   └── components/
│       │       ├── CVCard.tsx
│       │       ├── CVList.tsx
│       │       └── EmptyState.tsx
│       └── model/
│           ├── useCVDashboard.ts
│           └── useATSAnalysis.ts
│
├── features/                       # Casos de uso con UI propia
│   ├── auth/
│   │   ├── login/ui/LoginForm.tsx
│   │   └── register/ui/RegisterForm.tsx
│   ├── cv-create/
│   │   ├── ui/
│   │   │   ├── CVForm.tsx
│   │   │   └── sections/
│   │   │       ├── PersonalInfoSection.tsx
│   │   │       ├── ExperienceSection.tsx
│   │   │       ├── EducationSection.tsx
│   │   │       ├── SkillsSection.tsx
│   │   │       ├── ProjectsSection.tsx
│   │   │       └── LanguagesSection.tsx
│   ├── cv-preview/
│   │   └── ui/
│   │       ├── CVPreview.tsx
│   │       ├── templates/          # Plantillas visuales
│   │       │   ├── ModernTemplate.tsx
│   │       │   ├── ProfessionalTemplate.tsx
│   │       │   └── CreativeTemplate.tsx
│   │       └── pdf/                # Generadores PDF
│   │           ├── ModernPDF.tsx
│   │           ├── ProfessionalPDF.tsx
│   │           ├── CreativePDF.tsx
│   │           └── ATSPDF.tsx      # PDF optimizado para ATS
│   └── ai-assistant/
│       ├── ui/
│       │   ├── AIAssistant.tsx
│       │   └── components/
│       │       ├── CVAdaptationCard.tsx
│       │       └── CoverLetterCard.tsx
│       └── model/
│           ├── useAIAssistant.ts   # Estado compartido del asistente
│           ├── useJobExtraction.ts # Extrae ofertas desde URL
│           ├── useCVAdapter.ts     # Adapta CV a oferta
│           └── useCoverLetter.ts  # Genera carta de presentación
│
├── entities/                       # Modelos de negocio compartidos
│   ├── cv/
│   │   ├── api/cvApi.ts           # CRUD de CVs contra la API REST
│   │   └── model/types.ts         # Tipos CV, CVData, Experience…
│   └── user/
│       ├── api/authApi.ts         # login, register, logout
│       └── model/authStore.ts     # Zustand store con persist
│
└── shared/                         # Sin lógica de negocio
    ├── ui/                        # shadcn/ui components
    ├── api/client.ts              # Instancia axios con interceptors
    ├── hooks/
    │   ├── use-theme.ts
    │   └── use-mobile.tsx
    ├── services/
    │   ├── geminiService.ts       # Llamadas directas a Gemini desde frontend
    │   └── storageService.ts      # localStorage helpers
    ├── lib/utils.ts               # cn(), helpers
    └── i18n/
        ├── config.ts              # i18next setup
        └── locales/
            ├── es.json
            └── en.json
```

### Regla de imports: solo hacia abajo

Cada capa solo puede importar de capas inferiores. Nunca al mismo nivel ni hacia arriba:

```
app → pages → widgets → features → entities → shared
```

```typescript
// ✅ Correcto
import { Button } from '@/shared/ui/button';           // shared es la base
import { CV } from '@/entities/cv/model/types';        // entity por feature
import { AIAssistant } from '@/features/ai-assistant'; // feature por widget

// ❌ Prohibido
import { useCVDashboard } from '@/widgets/cv-dashboard'; // widget por feature
import { LoginForm } from '@/features/auth/login';       // feature por otra feature
```

### Convención: lógica en `model/`, UI en `ui/`

Cada feature/widget separa:
- `ui/` — componentes React (solo renderizado y eventos)
- `model/` — hooks con lógica de negocio (estado, efectos, llamadas API)

```typescript
// features/ai-assistant/model/useAIAssistant.ts
// Gestiona el estado global del asistente; la UI no contiene lógica
export const useAIAssistant = () => {
  const [jobUrl, setJobUrl] = useState('');
  const [adaptation, setAdaptation] = useState<AdaptationData | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  // ...
  return { jobUrl, setJobUrl, adaptation, setAdaptation, coverLetter, ... };
};

// features/ai-assistant/ui/AIAssistant.tsx
// Solo consume el hook; no hay useState ni llamadas API aquí
export const AIAssistant = () => {
  const state = useAIAssistant();
  const { extract } = useJobExtraction(state);
  const { adapt } = useCVAdapter(state);
  return <CVAdaptationCard state={state} onExtract={extract} onAdapt={adapt} />;
};
```

---

## Flujos de Datos

### Flujo: Adaptación de CV con IA

```
1. Usuario pega URL de oferta en CVAdaptationCard
           ↓
2. useJobExtraction.extract(url)
           ↓
3. POST /jobs/extract-from-url  →  Backend
           ↓
4. extractJobFromUrl controller
           ↓
5. JobScraperService.scrape(url)  +  GeminiService.parseJobOffer()
           ↓
6. Retorna JobOfferData estructurada
           ↓
7. Frontend muestra descripción de la oferta
           ↓
8. Usuario click "Adaptar CV"
           ↓
9. useCVAdapter.adapt(cv, jobOffer)
           ↓
10. POST /cv/adapt-to-job-offer  →  Backend
           ↓
11. AdaptToJobOfferUseCase.execute(cvId, jobOffer)
           ↓
12. GeminiService.adaptCV(cvData, jobDescription)
           ↓
13. Retorna AdaptationData { score, matchedSkills, suggestions }
           ↓
14. Frontend actualiza estado; usuario aplica sugerencias al editor
```

### Flujo: Autenticación JWT

```
1. Usuario submit LoginForm (validado con Zod)
           ↓
2. authService.login({ email, password })
           ↓
3. POST /auth/signin  →  Backend
           ↓
4. SignInUseCase.execute(email, password)
           ↓
5. PrismaUserRepository.findByEmail(email)
           ↓
6. bcrypt.compare(password, user.passwordHash)
           ↓
7. JWTService.sign({ userId, email })
           ↓
8. Retorna { user, token }
           ↓
9. authStore.setAuth(user, token)  — Zustand + localStorage persist
           ↓
10. navigate('/')
```

### Flujo: Guardado de CV

```
1. Usuario click "Guardar CV" en CVDashboard
           ↓
2. useCVDashboard.saveCV(cvData)
           ↓
3. cvApi.create(cvData)  o  cvApi.update(id, cvData)
           ↓
4. POST /cvs  →  CreateCVUseCase  →  PrismaCVRepository.save()
           ↓
5. PostgreSQL INSERT
           ↓
6. Retorna CV creado
           ↓
7. TanStack Query invalida caché → refetch automático de lista CVs
```

---

## Decisiones Técnicas

### Backend

**¿Por qué Clean Architecture y no MVC simple?**

| Ventaja | Impacto |
|---------|---------|
| Testabilidad | Los use-cases se testean inyectando repositorios mock sin tocar la BD |
| Cambio de ORM | Sustituir Prisma por TypeORM solo afecta a `infrastructure/repositories/` |
| Cambio de framework | Express → Fastify solo afecta a `application/` |
| Lógica aislada | Los bugs de negocio se localizan en `domain/`, no se mezclan con HTTP |

**¿Por qué los use-cases están en `domain/` y no en `application/`?**

Decisión consciente: los use-cases son lógica de negocio pura (validan, orquestan entidades, usan interfaces de repositorio), por lo que pertenecen al dominio. La capa `application/` es exclusivamente HTTP: traduce requests HTTP a DTOs y delega en use-cases.

**¿Por qué Prisma?**

- Type-safety completa: errores de esquema en tiempo de compilación
- Migraciones declarativas con `prisma migrate`
- El repository pattern mitiga el lock-in: si cambiamos de ORM, solo se reescriben los ficheros en `infrastructure/repositories/`

### Frontend

**¿Por qué FSD y no estructura por tipo (`components/`, `hooks/`, `pages/`)?**

| Ventaja | Impacto |
|---------|---------|
| Escalabilidad | Añadir la feature `cv-share` no toca nada existente |
| Ownership claro | Todo lo del AI assistant vive en `features/ai-assistant/` |
| Testabilidad | Los hooks de `model/` se testean sin montar UI (84-95% coverage) |
| Onboarding | La estructura es predecible: buscar por dominio, no por tipo de archivo |

**¿Por qué Zustand en lugar de Redux Toolkit?**

- Sin boilerplate de actions/reducers/slices
- Sin `<Provider>` wrapper
- Plugin `persist` integrado para localStorage
- TypeScript first-class sin `createSlice` genérico

**¿Por qué shadcn/ui en lugar de MUI o Chakra?**

- Los componentes son código propio (copy-paste, no dependencia de runtime)
- Tailwind nativo, sin conflictos con utility classes propias
- Primitivos Radix UI garantizan accesibilidad sin configuración extra
- Customización sin mecanismos de `theme override` o `sx` prop

**¿Por qué Vitest + Playwright en lugar de Jest + Cypress?**

- Vitest es nativo de Vite: misma config, transformaciones y aliases que el proyecto
- Playwright es más rápido que Cypress en CI (paralelización real entre navegadores)
- Combinación: Vitest cubre lógica de hooks (ms por test), Playwright cubre flujos completos

---

## Referencias

- [Clean Architecture — Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [Zustand documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [shadcn/ui](https://ui.shadcn.com/)

---

*Última actualización: Abril 2025*
