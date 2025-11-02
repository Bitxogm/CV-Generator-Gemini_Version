import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';

Font.register({
  family: 'Arial',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/arial/v12/arial.ttf' },
  ],
});

// ATS-optimized PDF with simple, machine-readable format
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.2,
    color: '#000000',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1pt solid #000000',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
    paddingBottom: 2,
    borderBottom: '1pt solid #000000',
  },
  text: {
    fontSize: 9,
    marginBottom: 4,
    lineHeight: 1.3,
  },
  bold: {
    fontWeight: 'bold',
  },
  subsection: {
    marginBottom: 6,
  },
  bulletPoint: {
    marginLeft: 15,
    marginBottom: 3,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  summaryIntro: {
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 4,
  },
  summaryBulletHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 3,
    marginTop: 2,
  },
  bulletItem: {
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 2,
    marginLeft: 10,
  },
});

interface ATSPDFProps {
  data: CVData;
  language?: 'es' | 'en';
}

const translations = {
  es: {
    professionalSummary: 'RESUMEN PROFESIONAL',
    experience: 'EXPERIENCIA PROFESIONAL',
    education: 'EDUCACIÓN',
    skills: 'HABILIDADES TÉCNICAS',
    softSkills: 'COMPETENCIAS',
    projects: 'PROYECTOS',
    languages: 'IDIOMAS',
    present: 'Presente',
    gpa: 'GPA',
  },
  en: {
    professionalSummary: 'PROFESSIONAL SUMMARY',
    experience: 'WORK EXPERIENCE',
    education: 'EDUCATION',
    skills: 'TECHNICAL SKILLS',
    softSkills: 'SOFT SKILLS',
    projects: 'PROJECTS',
    languages: 'LANGUAGES',
    present: 'Present',
    gpa: 'GPA',
  },
};

export function ATSPDF({ data, language = 'es' }: ATSPDFProps) {
  const t = translations[language];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Name */}
        <Text style={styles.name}>{data.personalInfo.fullName.toUpperCase()}</Text>

        {/* Contact Info */}
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

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.professionalSummary}</Text>
            <Text style={styles.text}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.experience}</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.subsection}>
                <Text style={[styles.text, styles.bold]}>{exp.position}</Text>
                <Text style={styles.text}>
                  {exp.company}, {exp.location} | {exp.startDate} - {exp.current ? t.present : exp.endDate}
                </Text>
                {exp.description.split('\n').map((line, lineIndex) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;

                  // Bullet items
                  if (trimmedLine.startsWith('•')) {
                    return <Text key={lineIndex} style={styles.bulletItem}>{trimmedLine}</Text>;
                  }

                  // Bullet header (ends with ":")
                  if (trimmedLine.endsWith(':')) {
                    return <Text key={lineIndex} style={styles.summaryBulletHeader}>{trimmedLine}</Text>;
                  }

                  // Regular text
                  return <Text key={lineIndex} style={styles.text}>{trimmedLine}</Text>;
                })}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.education}</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.subsection}>
                <Text style={[styles.text, styles.bold]}>{edu.degree} in {edu.field}</Text>
                <Text style={styles.text}>
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
            <Text style={styles.text}>{data.skills.join(', ')}</Text>
          </View>
        )}

        {/* Soft Skills */}
        {data.softSkills && data.softSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.softSkills}</Text>
            <Text style={styles.text}>{data.softSkills.join(', ')}</Text>
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.projects}</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.subsection}>
                <Text style={[styles.text, styles.bold]}>{project.name}</Text>
                <Text style={styles.text}>{project.description}</Text>
                <Text style={styles.text}>Technologies: {project.technologies.join(', ')}</Text>
                {project.link && <Text style={styles.text}>{project.link}</Text>}
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
