import { CVData } from '@/entities/cv/model';

export const victorData: CVData = {
  personalInfo: {
    fullName: 'Victor Manuel González Moreno',
    email: 'vmmoreno1999@gmail.com',
    phone: '+34 622 696 266',
    location: 'Barakaldo, Vizcaya',
    linkedin: 'linkedin.com/in/victor-manuel-gonzalez-moreno',
    github: 'github.com/Bitxogm',
    website: 'https://bitxodev.com',
    photo: '',
  },

  summary:
    '• Desarrollador Web Full-Stack con proyectos reales en producción integrando IA (Claude API, Gemini, RAG)\n' +
    '• Graduado KeepCoding 2025 · Stack: React, Next.js, Node.js, PostgreSQL, Docker y AWS\n' +
    '• Background de 8+ años en gestión de proyectos industriales internacionales — madurez, rigor y trabajo bajo presión\n' +
    '• Inglés B2 · Incorporación inmediata',

  experience: [
    {
      id: '1',
      company: 'Gestamp',
      position: 'Team Leader / Gestor de Proyectos Internacionales',
      location: 'Barakaldo',
      startDate: '2016',
      endDate: '2024',
      current: false,
      description:
        'Gestión de proyectos de alta exigencia para OEMs premium (Mercedes-Benz, BMW, Audi, VW) ' +
        'con equipos técnicos de +15 personas a nivel internacional.\n\n' +
        '• Coordinación de ciclos de entrega en España, Alemania e India con deadlines inamovibles.\n' +
        '• Resolución de bloqueos técnicos críticos en tiempo real bajo presión extrema.\n' +
        '• Interlocución directa con ingeniería de clientes premium (client-facing).\n' +
        '• Diseño e implementación de procesos de mejora continua con margen de error cero.',
    },
  ],

  education: [
    {
      id: '1',
      institution: 'KeepCoding Web Bootcamp',
      degree: 'Desarrollo Web Full-Stack',
      field: 'Bootcamp intensivo (+800h) · Cantabria',
      startDate: '2025',
      endDate: '2026',
      current: false,
    },
    {
      id: '2',
      institution: 'Instituto Nicolás Larburu',
      degree: 'Grado Superior — Fabricación y Ajuste de Matricería',
      field: 'Estudios Técnicos · Barakaldo',
      startDate: '',
      endDate: '',
      current: false,
    },
  ],

  skills: [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
    'Python', 'PostgreSQL', 'MongoDB', 'Prisma', 'Docker', 'AWS',
    'Git', 'HTML5', 'CSS3', 'TailwindCSS', 'Responsive Design',
  ],

  softSkills: [
    'Gestión de proyectos complejos',
    'Resolución de problemas críticos',
    'Comunicación efectiva (client-facing)',
    'Trabajo en equipo',
    'Atención al detalle',
    'Autonomía y autoaprendizaje',
    'Agile / Scrum',
  ],

  projects: [
    {
      id: '1',
      name: 'TestLab AI — Generador y Ejecutor de Tests con IA',
      description:
        'Monorepo full-stack para generación y ejecución automática de tests.\n' +
        '• Arquitectura hexagonal en backend (Express) con sandboxes Docker aislados.\n' +
        '• Almacenamiento dual PostgreSQL/Prisma + MongoDB y WebSockets en tiempo real.',
      technologies: ['Next.js', 'Express', 'Gemini API', 'Docker', 'Socket.io', 'PostgreSQL', 'Prisma', 'MongoDB'],
      link: '',
    },
    {
      id: '2',
      name: 'AgentLogic AI — Tutor Inteligente de Programación',
      description:
        'Plataforma educativa interactiva con chat tutor personalizado.\n' +
        '• Módulos de generación de código IA y visualización algorítmica.\n' +
        '• Gestión de usuarios y métricas bajo Firebase / MongoDB Atlas.',
      technologies: ['Firebase', 'MongoDB Atlas', 'Gemini AI', 'TypeScript'],
      link: 'https://agentlogic.bitxodev.com/',
    },
    {
      id: '3',
      name: 'Asistente de Refactorización con IA',
      description:
        'Herramienta orientada a clean-code y calidad de software.\n' +
        '• Analiza código multilenguaje y sugiere refactorizaciones con Gemini API.\n' +
        '• Arquitectura REST desacoplada con frontend React y backend Node.js.',
      technologies: ['Node.js', 'React', 'TypeScript', 'Gemini API', 'REST'],
      link: 'https://codeai.bitxodev.com/',
    },
    {
      id: '4',
      name: 'CV Crafter — Generador de CVs Profesionales',
      description:
        'SaaS frontend para creación de CVs con plantillas múltiples.\n' +
        '• Análisis ATS potenciado por IA (Gemini) con puntuación y sugerencias.\n' +
        '• Manejo avanzado de estado en React y renderizado de PDF en cliente.',
      technologies: ['React', 'TypeScript', 'Vite', 'Gemini API', 'TailwindCSS'],
      link: 'https://cvgenerator.bitxodev.com/',
    },
  ],

  languages: [],
};
