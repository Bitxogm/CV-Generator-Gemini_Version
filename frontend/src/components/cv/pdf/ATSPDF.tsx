import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { getPdfDensity, getPdfScales } from './pdfDensity';

Font.register({
  family: 'Arial',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/arial/v12/arial.ttf' },
  ],
});

// ATS-optimized PDF with simple, machine-readable format
const createStyles = (fontScale: number, spacingScale: number) => {
  const f = (value: number) => value * fontScale;
  const s = (value: number) => value * spacingScale;

  return StyleSheet.create({
    page: {
      padding: s(30),
      fontFamily: 'Helvetica',
      fontSize: f(9),
      lineHeight: f(1.2),
      color: '#000000',
    },
    name: {
      fontSize: f(18),
      fontWeight: 'bold',
      marginBottom: s(6),
      textAlign: 'center',
    },
    contactInfo: {
      fontSize: f(9),
      textAlign: 'center',
      marginBottom: s(12),
      paddingBottom: s(8),
      borderBottom: '1pt solid #000000',
    },
    section: {
      marginBottom: s(8),
    },
    sectionTitle: {
      fontSize: f(12),
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: s(5),
      paddingBottom: s(2),
      borderBottom: '1pt solid #000000',
    },
    text: {
      fontSize: f(9),
      marginBottom: s(4),
      lineHeight: f(1.3),
    },
    bold: {
      fontWeight: 'bold',
    },
    subsection: {
      marginBottom: s(6),
    },
    bulletPoint: {
      marginLeft: s(15),
      marginBottom: s(3),
    },
    summaryTitle: {
      fontSize: f(14),
      fontWeight: 'bold',
      marginBottom: s(6),
      textAlign: 'center',
    },
    summaryIntro: {
      fontSize: f(9),
      lineHeight: f(1.3),
      marginBottom: s(4),
    },
    summaryBulletHeader: {
      fontSize: f(9),
      fontWeight: 'bold',
      marginBottom: s(3),
      marginTop: s(2),
    },
    bulletItem: {
      fontSize: f(9),
      lineHeight: f(1.3),
      marginBottom: s(2),
      marginLeft: s(10),
    },
  });
};

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
  const density = getPdfDensity(data);
  const { fontScale, spacingScale } = getPdfScales(density);
  const styles = createStyles(fontScale, spacingScale);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
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
            {data.summary.split('\n').filter(l => l.trim()).map((line, i) => (
              <Text key={i} style={styles.bulletItem}>{line.startsWith('•') ? line : `• ${line}`}</Text>
            ))}
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
