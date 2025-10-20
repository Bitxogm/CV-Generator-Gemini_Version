export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects?: Project[];
  awards?: Award[];
  languages?: Language[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
}

export type TemplateType = 'modern' | 'professional' | 'creative';

export interface ATSAnalysis {
  score: number;
  keywords: {
    matched: string[];
    missing: string[];
  };
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}
