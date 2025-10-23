import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

interface ModernTemplateProps {
  data: CVData;
  language?: 'es' | 'en';
}

const translations = {
  es: {
    professionalSummary: 'Resumen Profesional',
    experience: 'Experiencia Profesional',
    education: 'Educación',
    skills: 'Habilidades Técnicas',
    softSkills: 'Competencias',
    projects: 'Proyectos',
    languages: 'Idiomas',
    present: 'Presente',
    gpa: 'GPA',
  },
  en: {
    professionalSummary: 'Professional Summary',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Technical Skills',
    softSkills: 'Soft Skills',
    projects: 'Projects',
    languages: 'Languages',
    present: 'Present',
    gpa: 'GPA',
  },
};

export function ModernTemplate({ data, language = 'es' }: ModernTemplateProps) {
  const t = translations[language];
  return (
    <div className="bg-background text-foreground p-8 max-w-4xl mx-auto shadow-elegant">
      {/* Header */}
      <div className="border-b-2 border-primary pb-6 mb-6">
        <h1 className="text-4xl font-display font-bold text-foreground mb-2">
          {data.personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span>{data.personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{data.personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{data.personalInfo.location}</span>
          </div>
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 flex-shrink-0" />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 flex-shrink-0" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
          {data.personalInfo.github && (
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 flex-shrink-0" />
              <span>{data.personalInfo.github}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-2xl font-display font-semibold text-primary mb-3">
            {t.professionalSummary}
          </h2>
          <p className="text-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-display font-semibold text-primary mb-3">
            {t.experience}
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg text-foreground">{exp.position}</h3>
                  <span className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.current ? t.present : exp.endDate}
                  </span>
                </div>
                <p className="text-primary font-medium mb-2">
                  {exp.company} • {exp.location}
                </p>
                <p className="text-foreground leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-display font-semibold text-primary mb-3">
            {t.education}
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg text-foreground">{edu.degree}</h3>
                  <span className="text-sm text-muted-foreground">
                    {edu.startDate} - {edu.current ? t.present : edu.endDate}
                  </span>
                </div>
                <p className="text-primary font-medium">
                  {edu.institution} • {edu.field}
                </p>
                {edu.gpa && <p className="text-sm text-muted-foreground">{t.gpa}: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-display font-semibold text-primary mb-3">
            {t.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Soft Skills */}
      {data.softSkills && data.softSkills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-display font-semibold text-primary mb-3">
            {t.softSkills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.softSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-display font-semibold text-primary mb-3">
            {t.projects}
          </h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-semibold text-lg text-foreground mb-1">{project.name}</h3>
                <p className="text-foreground leading-relaxed mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a href={project.link} className="text-primary text-sm hover:underline mt-1 inline-block">
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary mb-3">
            {t.languages}
          </h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang) => (
              <div key={lang.id}>
                <span className="font-medium text-foreground">{lang.name}</span>
                <span className="text-muted-foreground"> - {lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
