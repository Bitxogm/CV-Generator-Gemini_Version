// Interfaces para el contenido del CV
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  photo?: string; // base64 data URL (max 2MB)
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies?: string[];
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  projects: Project[];
}

export interface JobOfferData {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location?: string;
  salary?: string;
}

export interface Suggestion {
  id: string;
  type: 'improve' | 'add' | 'remove';
  section: string; // "experience", "skills", etc
  text: string;
  priority: 'high' | 'medium' | 'low';
}

// Props para la entidad CV
export interface CVProps {
  id: string;
  userId: string;
  title: string;
  cvData: CVData;
  pdfUrl?: string;
  jobOffer?: JobOfferData;
  coverLetter?: string;
  suggestions: Suggestion[];
  createdAt: Date;
  updatedAt: Date;
}

// Entidad de dominio CV
export class CV {
  public readonly id: string;
  public readonly userId: string;
  public readonly title: string;
  public readonly cvData: CVData;
  public readonly pdfUrl?: string;
  public readonly jobOffer?: JobOfferData;
  public readonly coverLetter?: string;
  public readonly suggestions: Suggestion[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CVProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.title = props.title;
    this.cvData = props.cvData;
    this.pdfUrl = props.pdfUrl;
    this.jobOffer = props.jobOffer;
    this.coverLetter = props.coverLetter;
    this.suggestions = props.suggestions;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  // Helper: Agregar sugerencia
  public addSuggestion(suggestion: Suggestion): CV {
    return new CV({
      ...this,
      suggestions: [...this.suggestions, suggestion],
    });
  }

  // Helper: Aplicar oferta de trabajo
  public applyJobOffer(jobOffer: JobOfferData): CV {
    return new CV({
      ...this,
      jobOffer,
      updatedAt: new Date(),
    });
  }

  // Helper: Guardar PDF generado
  public setPdfUrl(pdfUrl: string): CV {
    return new CV({
      ...this,
      pdfUrl,
      updatedAt: new Date(),
    });
  }

  // Helper: Guardar carta de presentación
  public setCoverLetter(coverLetter: string): CV {
    return new CV({
      ...this,
      coverLetter,
      updatedAt: new Date(),
    });
  }
}
