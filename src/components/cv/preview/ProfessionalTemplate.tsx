import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

interface ProfessionalTemplateProps {
  data: CVData;
  language?: 'es' | 'en';
}

const translations = {
  es: {
    contact: 'Contacto',
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
    contact: 'Contact',
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

export function ProfessionalTemplate({ data, language = 'es' }: ProfessionalTemplateProps) {
  const t = translations[language];
  return (
    <div className="bg-background text-foreground max-w-4xl mx-auto">
      <div className="grid grid-cols-3 gap-0">
        {/* Sidebar */}
        <div className="col-span-1 bg-muted p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">
              {data.personalInfo.fullName}
            </h1>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              {t.contact}
            </h3>
            <div className="space-y-2 text-sm text-foreground">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{data.personalInfo.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{data.personalInfo.location}</span>
              </div>
              {data.personalInfo.linkedin && (
                <div className="flex items-start gap-2">
                  <Linkedin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{data.personalInfo.linkedin}</span>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{data.personalInfo.website}</span>
                </div>
              )}
              {data.personalInfo.github && (
                <div className="flex items-start gap-2">
                  <Github className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{data.personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
                {t.skills}
              </h3>
              <div className="space-y-1.5 text-sm text-foreground">
                {data.skills.map((skill, index) => (
                  <div key={index}>• {skill}</div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {data.softSkills && data.softSkills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
                {t.softSkills}
              </h3>
              <div className="space-y-1.5 text-sm text-foreground">
                {data.softSkills.map((skill, index) => (
                  <div key={index}>• {skill}</div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
                {t.languages}
              </h3>
              <div className="space-y-2 text-sm text-foreground">
                {data.languages.map((lang) => (
                  <div key={lang.id}>
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-muted-foreground">{lang.proficiency}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 p-6">
          {/* Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-display font-bold text-primary mb-3 pb-2 border-b-2 border-primary">
                {t.professionalSummary.toUpperCase()}
              </h2>
              <p className="text-foreground leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-display font-bold text-primary mb-3 pb-2 border-b-2 border-primary">
                {t.experience.toUpperCase()}
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <h3 className="font-bold text-foreground">{exp.position}</h3>
                    <div className="text-sm text-primary font-medium">
                      {exp.company} • {exp.location}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {exp.startDate} - {exp.current ? t.present : exp.endDate}
                    </div>
                    <p className="text-foreground leading-relaxed text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-display font-bold text-primary mb-3 pb-2 border-b-2 border-primary">
                {t.education.toUpperCase()}
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-foreground">{edu.degree}</h3>
                    <div className="text-sm text-primary font-medium">
                      {edu.institution} • {edu.field}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.current ? t.present : edu.endDate}
                      {edu.gpa && ` • ${t.gpa}: ${edu.gpa}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-display font-bold text-primary mb-3 pb-2 border-b-2 border-primary">
                {t.projects.toUpperCase()}
              </h2>
              <div className="space-y-4">
                {data.projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-bold text-foreground">{project.name}</h3>
                    <p className="text-foreground text-sm leading-relaxed mb-2">
                      {project.description}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      {project.technologies.join(' • ')}
                    </div>
                    {project.link && (
                      <a href={project.link} className="text-primary text-sm hover:underline">
                        {project.link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
