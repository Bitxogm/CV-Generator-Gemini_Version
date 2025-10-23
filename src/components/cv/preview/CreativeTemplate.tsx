import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

interface CreativeTemplateProps {
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

export function CreativeTemplate({ data, language = 'es' }: CreativeTemplateProps) {
  const t = translations[language];
  return (
    <div className="bg-background text-foreground max-w-4xl mx-auto">
      {/* Creative Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div className="relative p-8 text-white">
          <h1 className="text-5xl font-display font-bold mb-4">
            {data.personalInfo.fullName}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{data.personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.personalInfo.location}</span>
            </div>
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{data.personalInfo.website}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-1">
                <Github className="w-4 h-4" />
                <span>{data.personalInfo.github}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary with Accent */}
        {data.summary && (
          <div className="mb-8 p-6 bg-accent/10 rounded-lg border-l-4 border-accent">
            <h2 className="text-2xl font-display font-bold text-accent mb-3">
              {t.professionalSummary}
            </h2>
            <p className="text-foreground leading-relaxed italic">{data.summary}</p>
          </div>
        )}

        {/* Experience with Timeline */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-primary mb-6">
              {t.experience}
            </h2>
            <div className="space-y-6 border-l-2 border-primary/30 pl-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-8 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-foreground">{exp.position}</h3>
                      <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded">
                        {exp.startDate} - {exp.current ? t.present : exp.endDate}
                      </span>
                    </div>
                    <p className="text-primary font-semibold mb-2">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-primary mb-6">
              {t.education}
            </h2>
            <div className="grid gap-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-foreground">{edu.degree}</h3>
                    <span className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.current ? t.present : edu.endDate}
                    </span>
                  </div>
                  <p className="text-primary font-medium">
                    {edu.institution} • {edu.field}
                  </p>
                  {edu.gpa && <p className="text-sm text-muted-foreground mt-1">{t.gpa}: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills with Pills */}
        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-primary mb-6">
              {t.skills}
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-sm hover-scale"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {data.softSkills && data.softSkills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-primary mb-6">
              {t.softSkills}
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.softSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-sm hover-scale"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-primary mb-6">
              {t.projects}
            </h2>
            <div className="grid gap-4">
              {data.projects.map((project) => (
                <div key={project.id} className="bg-muted/50 p-4 rounded-lg border-l-4 border-accent">
                  <h3 className="font-bold text-lg text-foreground mb-2">{project.name}</h3>
                  <p className="text-foreground leading-relaxed mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent/20 text-accent rounded text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <a href={project.link} className="text-primary hover:underline text-sm">
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
            <h2 className="text-2xl font-display font-bold text-primary mb-6">
              {t.languages}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.languages.map((lang) => (
                <div key={lang.id} className="bg-muted/50 p-3 rounded-lg">
                  <div className="font-bold text-foreground">{lang.name}</div>
                  <div className="text-sm text-primary">{lang.proficiency}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
