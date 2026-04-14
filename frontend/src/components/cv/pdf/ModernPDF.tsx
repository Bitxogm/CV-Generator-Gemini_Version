import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { getPdfDensity, getPdfScales } from './pdfDensity';

// Using system font (Helvetica) for compatibility with @react-pdf

const createStyles = (fontScale: number, spacingScale: number) => {
  const f = (value: number) => value * fontScale;
  const s = (value: number) => value * spacingScale;

  return StyleSheet.create({
    page: {
      padding: s(35),
      fontFamily: 'Helvetica',
      fontSize: f(9),
      color: '#1a1a1a',
    },
    header: {
      borderBottom: '1pt solid #000000',
      paddingBottom: s(15),
      marginBottom: s(20),
    },
    name: {
      fontSize: f(28),
      fontWeight: 'bold',
      marginBottom: s(8),
      color: '#000000',
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: s(12),
      fontSize: f(9),
      color: '#000000',
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      marginBottom: s(12),
    },
    sectionTitle: {
      fontSize: f(14),
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: s(10),
      textTransform: 'uppercase',
      borderBottom: '1pt solid #000000',
      paddingBottom: s(3),
    },
    summaryText: {
      lineHeight: f(1.3),
      fontSize: f(10),
      color: '#000000',
    },
    experienceItem: {
      marginBottom: s(12),
    },
    jobTitle: {
      fontSize: f(12),
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: s(3),
    },
    company: {
      fontSize: f(10),
      color: '#000000',
      fontWeight: 'bold',
      marginBottom: s(2),
    },
    dateLocation: {
      fontSize: f(9),
      color: '#000000',
      marginBottom: s(5),
    },
    description: {
      fontSize: f(10),
      lineHeight: f(1.4),
      color: '#000000',
    },
    skillsContainer: {
      fontSize: f(10),
    },
    skillPill: {
      fontSize: f(10),
      color: '#000000',
    },
    educationItem: {
      marginBottom: s(10),
    },
    degree: {
      fontSize: f(12),
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: s(3),
    },
    institution: {
      fontSize: f(10),
      color: '#000000',
      fontWeight: 'bold',
      marginBottom: s(2),
    },
    projectItem: {
      marginBottom: s(10),
    },
    projectName: {
      fontSize: f(11),
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: s(3),
    },
    techStack: {
      fontSize: f(9),
      color: '#000000',
      marginTop: s(3),
    },
    languageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: s(15),
    },
    languageItem: {
      fontSize: f(10),
    },
    summaryTitle: {
      fontSize: f(16),
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: s(8),
      textAlign: 'center',
    },
    summaryIntro: {
      fontSize: f(10),
      lineHeight: f(1.3),
      color: '#000000',
      marginBottom: s(6),
    },
    summaryBulletHeader: {
      fontSize: f(10),
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: s(4),
      marginTop: s(3),
    },
    bulletItem: {
      fontSize: f(9),
      lineHeight: f(1.4),
      color: '#000000',
      marginBottom: s(3),
      paddingLeft: s(10),
    },
  });
};

interface ModernPDFProps {
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

export function ModernPDF({ data, language = 'es' }: ModernPDFProps) {
  const t = translations[language];
  const density = getPdfDensity(data);
  const { fontScale, spacingScale } = getPdfScales(density);
  const styles = createStyles(fontScale, spacingScale);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{data.personalInfo.fullName}</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
                <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
                <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
                {data.personalInfo.linkedin && <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>}
                {data.personalInfo.website && <Text style={styles.contactItem}>{data.personalInfo.website}</Text>}
                {data.personalInfo.github && <Text style={styles.contactItem}>{data.personalInfo.github}</Text>}
              </View>
            </View>
            {data.personalInfo.photo && (
              <Image
                src={data.personalInfo.photo}
                style={{ width: fontScale * 60, height: fontScale * 60, borderRadius: fontScale * 30, marginLeft: spacingScale * 10 }}
              />
            )}
          </View>
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
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{exp.position}</Text>
                <Text style={styles.company}>{exp.company} • {exp.location}</Text>
                <Text style={styles.dateLocation}>
                  {exp.startDate} - {exp.current ? t.present : exp.endDate}
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
                  return <Text key={lineIndex} style={styles.description}>{trimmedLine}</Text>;
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
              <View key={index} style={styles.educationItem}>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.institution}>{edu.institution} • {edu.field}</Text>
                <Text style={styles.dateLocation}>
                  {edu.startDate} - {edu.current ? t.present : edu.endDate}
                  {edu.gpa && ` • ${t.gpa}: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.skills}</Text>
            <Text style={styles.skillsContainer}>{data.skills.join(', ')}</Text>
          </View>
        )}

        {/* Soft Skills */}
        {data.softSkills && data.softSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.softSkills}</Text>
            <Text style={styles.skillsContainer}>{data.softSkills.join(', ')}</Text>
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
                <Text style={styles.techStack}>{project.technologies.join(' • ')}</Text>
                {project.link && <Text style={styles.techStack}>{project.link}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.languages}</Text>
            <View style={styles.languageContainer}>
              {data.languages.map((lang, index) => (
                <Text key={index} style={styles.languageItem}>
                  {lang.name} - {lang.proficiency}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
