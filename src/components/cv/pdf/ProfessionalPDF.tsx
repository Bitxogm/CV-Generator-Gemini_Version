import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';

// Using system font (Helvetica) for compatibility with @react-pdf


const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#000000',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '1pt solid #000000',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 5,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textTransform: 'uppercase',
    borderBottom: '1pt solid #000000',
    paddingBottom: 3,
  },
  contactItem: {
    fontSize: 10,
    marginBottom: 3,
  },
  skillText: {
    fontSize: 10,
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    marginBottom: 8,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateLocation: {
    fontSize: 9,
    color: '#000000',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  techStack: {
    fontSize: 9,
    color: '#000000',
    marginTop: 2,
  },
});

interface ProfessionalPDFProps {
  data: CVData;
  language?: 'es' | 'en';
}

const translations = {
  es: {
    contact: 'Contacto',
    professionalSummary: 'RESUMEN PROFESIONAL',
    experience: 'EXPERIENCIA PROFESIONAL',
    education: 'EDUCACIÓN',
    skills: 'Habilidades Técnicas',
    softSkills: 'Competencias',
    projects: 'PROYECTOS',
    languages: 'Idiomas',
    present: 'Presente',
    gpa: 'GPA',
  },
  en: {
    contact: 'Contact',
    professionalSummary: 'PROFESSIONAL SUMMARY',
    experience: 'WORK EXPERIENCE',
    education: 'EDUCATION',
    skills: 'Technical Skills',
    softSkills: 'Soft Skills',
    projects: 'PROJECTS',
    languages: 'Languages',
    present: 'Present',
    gpa: 'GPA',
  },
};

export function ProfessionalPDF({ data, language = 'es' }: ProfessionalPDFProps) {
  const t = translations[language];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName.toUpperCase()}</Text>
          <View style={styles.contactInfo}>
            <Text>{data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}</Text>
            {(data.personalInfo.linkedin || data.personalInfo.website || data.personalInfo.github) && (
              <Text>
                {[data.personalInfo.linkedin, data.personalInfo.website, data.personalInfo.github]
                  .filter(Boolean)
                  .join(' | ')}
              </Text>
            )}
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.professionalSummary}</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.experience}</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{exp.position}</Text>
                <Text style={styles.company}>{exp.company}, {exp.location} | {exp.startDate} - {exp.current ? t.present : exp.endDate}</Text>
                <Text style={styles.description}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.education}</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.degree}>{edu.degree} in {edu.field}</Text>
                <Text style={styles.company}>
                  {edu.institution} | {edu.startDate} - {edu.current ? t.present : edu.endDate}
                  {edu.gpa && ` | ${t.gpa}: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.skills}</Text>
            <Text style={styles.skillText}>{data.skills.join(', ')}</Text>
          </View>
        )}

        {/* Soft Skills */}
        {data.softSkills && data.softSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.softSkills}</Text>
            <Text style={styles.skillText}>{data.softSkills.join(', ')}</Text>
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.projects}</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.description}>{project.description}</Text>
                <Text style={styles.techStack}>Technologies: {project.technologies.join(', ')}</Text>
                {project.link && <Text style={styles.techStack}>{project.link}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.languages}</Text>
            <Text style={styles.text}>
              {data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
