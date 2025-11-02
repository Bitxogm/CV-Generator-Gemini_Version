import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';

// Using system font (Helvetica) for compatibility with @react-pdf


const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1a1a1a',
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#f3f4f6',
    padding: 25,
  },
  main: {
    width: '65%',
    padding: 25,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactItem: {
    fontSize: 8,
    marginBottom: 6,
    lineHeight: 1.3,
  },
  skillItem: {
    fontSize: 8,
    marginBottom: 4,
  },
  mainSection: {
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '2pt solid #3B82F6',
  },
  summary: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  company: {
    fontSize: 9,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateLocation: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  techStack: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },
  languageItem: {
    marginBottom: 6,
  },
  languageName: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  languageLevel: {
    fontSize: 8,
    color: '#6b7280',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryIntro: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 5,
  },
  summaryBulletHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 3,
    marginTop: 2,
  },
  bulletItem: {
    fontSize: 8,
    lineHeight: 1.3,
    marginBottom: 2,
    paddingLeft: 8,
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
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>{t.contact}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
            {data.personalInfo.linkedin && <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>}
            {data.personalInfo.website && <Text style={styles.contactItem}>{data.personalInfo.website}</Text>}
            {data.personalInfo.github && <Text style={styles.contactItem}>{data.personalInfo.github}</Text>}
          </View>

          {/* Skills */}
          {data.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>{t.skills}</Text>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>• {skill}</Text>
              ))}
            </View>
          )}

          {/* Soft Skills */}
          {data.softSkills && data.softSkills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>{t.softSkills}</Text>
              {data.softSkills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>• {skill}</Text>
              ))}
            </View>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>{t.languages}</Text>
              {data.languages.map((lang, index) => (
                <View key={index} style={styles.languageItem}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.languageLevel}>{lang.proficiency}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Summary */}
          {data.summary && (
            <View style={styles.mainSection}>
              {data.summary.split('\n').map((line, index) => {
                const trimmedLine = line.trim();

                // Skip empty lines
                if (!trimmedLine) return null;

                // First line is the title (all caps)
                if (index === 0 && trimmedLine === trimmedLine.toUpperCase()) {
                  return <Text key={index} style={styles.summaryTitle}>{trimmedLine}</Text>;
                }

                // Bullet items (lines starting with •)
                if (trimmedLine.startsWith('•')) {
                  return <Text key={index} style={styles.bulletItem}>{trimmedLine}</Text>;
                }

                // Bullet header (ends with ":")
                if (trimmedLine.endsWith(':')) {
                  return <Text key={index} style={styles.summaryBulletHeader}>{trimmedLine}</Text>;
                }

                // Regular intro text
                return <Text key={index} style={styles.summaryIntro}>{trimmedLine}</Text>;
              })}
            </View>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{t.experience}</Text>
              {data.experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.jobTitle}>{exp.position}</Text>
                  <Text style={styles.company}>{exp.company} • {exp.location}</Text>
                  <Text style={styles.dateLocation}>
                    {exp.startDate} - {exp.current ? t.present : exp.endDate}
                  </Text>
                  <Text style={styles.description}>{exp.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{t.education}</Text>
              {data.education.map((edu, index) => (
                <View key={index} style={styles.educationItem}>
                  <Text style={styles.degree}>{edu.degree}</Text>
                  <Text style={styles.company}>{edu.institution} • {edu.field}</Text>
                  <Text style={styles.dateLocation}>
                    {edu.startDate} - {edu.current ? t.present : edu.endDate}
                    {edu.gpa && ` • ${t.gpa}: ${edu.gpa}`}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{t.projects}</Text>
              {data.projects.map((project, index) => (
                <View key={index} style={styles.projectItem}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.description}>{project.description}</Text>
                  <Text style={styles.techStack}>{project.technologies.join(' • ')}</Text>
                  {project.link && <Text style={styles.techStack}>{project.link}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
