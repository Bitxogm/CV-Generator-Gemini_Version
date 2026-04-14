import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { getPdfDensity, getPdfScales } from './pdfDensity';

// Using system font (Helvetica) for compatibility with @react-pdf

const createStyles = (fontScale: number, spacingScale: number) => {
  const f = (value: number) => value * fontScale;
  const s = (value: number) => value * spacingScale;

  return StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: f(9),
      color: '#1a1a1a',
    },
    header: {
      backgroundColor: '#3B82F6',
      padding: s(20),
      color: 'white',
    },
    name: {
      fontSize: f(24),
      fontWeight: 'bold',
      marginBottom: s(6),
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: s(8),
      fontSize: f(8),
    },
    content: {
      padding: s(15),
    },
    summaryBox: {
      backgroundColor: '#EEF2FF',
      padding: s(10),
      borderLeft: '3pt solid #8B5CF6',
      marginBottom: s(10),
      borderRadius: s(3),
    },
    summaryHeading: {
      fontSize: f(10),
      fontWeight: 'bold',
      marginBottom: s(4),
      color: '#8B5CF6',
    },
    summaryContent: {
      fontSize: f(8),
      lineHeight: f(1.3),
    },
    section: {
      marginBottom: s(8),
    },
    sectionTitle: {
      fontSize: f(12),
      fontWeight: 'bold',
      color: '#3B82F6',
      marginBottom: s(6),
    },
    experienceTimeline: {
      borderLeft: '2pt solid #D1D5DB',
      paddingLeft: s(15),
    },
    experienceItem: {
      marginBottom: s(8),
      position: 'relative',
    },
    timelineDot: {
      position: 'absolute',
      left: s(-20),
      top: 0,
      width: s(8),
      height: s(8),
      backgroundColor: '#3B82F6',
      borderRadius: '50%',
    },
    experienceBox: {
      backgroundColor: '#F9FAFB',
      padding: s(8),
      borderRadius: s(3),
    },
    jobTitle: {
      fontSize: f(10),
      fontWeight: 'bold',
      marginBottom: s(3),
    },
    company: {
      fontSize: f(9),
      color: '#3B82F6',
      fontWeight: 'bold',
      marginBottom: s(4),
    },
    dateBox: {
      fontSize: f(7),
      backgroundColor: 'white',
      padding: `${s(2)}pt ${s(6)}pt`,
      borderRadius: s(2),
      color: '#6b7280',
      marginBottom: s(4),
    },
    description: {
      fontSize: f(8),
      lineHeight: f(1.3),
    },
    educationGrid: {
      gap: s(6),
    },
    educationBox: {
      backgroundColor: '#F9FAFB',
      padding: s(8),
      borderRadius: s(3),
      marginBottom: s(6),
    },
    degree: {
      fontSize: f(10),
      fontWeight: 'bold',
      marginBottom: s(3),
    },
    institution: {
      fontSize: f(9),
      color: '#3B82F6',
      fontWeight: 'bold',
      marginBottom: s(2),
    },
    educationDate: {
      fontSize: f(7),
      color: '#6b7280',
      marginTop: s(2),
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: s(5),
    },
    skillPill: {
      backgroundColor: '#3B82F6',
      color: 'white',
      padding: `${s(4)}pt ${s(8)}pt`,
      borderRadius: s(10),
      fontSize: f(8),
      fontWeight: 'bold',
    },
    projectBox: {
      backgroundColor: '#F9FAFB',
      padding: s(8),
      borderRadius: s(3),
      borderLeft: '3pt solid #8B5CF6',
      marginBottom: s(6),
    },
    projectName: {
      fontSize: f(10),
      fontWeight: 'bold',
      marginBottom: s(3),
    },
    projectTechRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: s(4),
    },
    techPill: {
      backgroundColor: '#EEF2FF',
      color: '#8B5CF6',
      padding: `${s(2)}pt ${s(6)}pt`,
      borderRadius: s(6),
      fontSize: f(7),
      fontWeight: 'bold',
      marginRight: s(3),
      marginTop: s(3),
    },
    projectLink: {
      fontSize: f(7),
      color: '#3B82F6',
      marginTop: s(3),
    },
    languageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: s(8),
    },
    languageBox: {
      backgroundColor: '#F9FAFB',
      padding: s(6),
      borderRadius: s(3),
      minWidth: '45%',
    },
    languageName: {
      fontSize: f(9),
      fontWeight: 'bold',
      marginBottom: s(1),
    },
    languageLevel: {
      fontSize: f(7),
      color: '#3B82F6',
    },
    summaryTitle: {
      fontSize: f(12),
      fontWeight: 'bold',
      color: '#8B5CF6',
      marginBottom: s(6),
      textAlign: 'center',
    },
    summaryIntro: {
      fontSize: f(8),
      lineHeight: f(1.3),
      marginBottom: s(4),
    },
    summaryBulletHeader: {
      fontSize: f(8),
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: s(3),
      marginTop: s(2),
    },
    bulletItem: {
      fontSize: f(7),
      lineHeight: f(1.3),
      marginBottom: s(2),
      paddingLeft: s(8),
    },
  });
};

interface CreativePDFProps {
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

export function CreativePDF({ data, language = 'es' }: CreativePDFProps) {
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
                <Text>{data.personalInfo.email}</Text>
                <Text>{data.personalInfo.phone}</Text>
                <Text>{data.personalInfo.location}</Text>
                {data.personalInfo.linkedin && <Text>{data.personalInfo.linkedin}</Text>}
                {data.personalInfo.website && <Text>{data.personalInfo.website}</Text>}
                {data.personalInfo.github && <Text>{data.personalInfo.github}</Text>}
              </View>
            </View>
            {data.personalInfo.photo && (
              <Image
                src={data.personalInfo.photo}
                style={{ width: fontScale * 60, height: fontScale * 60, borderRadius: fontScale * 30, border: '2pt solid white', marginLeft: spacingScale * 10 }}
              />
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Summary */}
          {data.summary && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryHeading}>{t.professionalSummary}</Text>
              {data.summary.split('\n').filter(l => l.trim()).map((line, i) => (
                <Text key={i} style={styles.bulletItem}>{line.startsWith('•') ? line : `• ${line}`}</Text>
              ))}
            </View>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.experience}</Text>
              <View style={styles.experienceTimeline}>
                {data.experience.map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceBox}>
                      <Text style={styles.jobTitle}>{exp.position}</Text>
                      <Text style={styles.company}>{exp.company} • {exp.location}</Text>
                      <Text style={styles.dateBox}>
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
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.education}</Text>
              <View style={styles.educationGrid}>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.educationBox}>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.institution}>{edu.institution} • {edu.field}</Text>
                    <Text style={styles.educationDate}>
                      {edu.startDate} - {edu.current ? t.present : edu.endDate}
                      {edu.gpa && ` • ${t.gpa}: ${edu.gpa}`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.skills}</Text>
              <View style={styles.skillsContainer}>
                {data.skills.map((skill, index) => (
                  <Text key={index} style={styles.skillPill}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {/* Soft Skills */}
          {data.softSkills && data.softSkills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.softSkills}</Text>
              <View style={styles.skillsContainer}>
                {data.softSkills.map((skill, index) => (
                  <Text key={index} style={styles.skillPill}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.projects}</Text>
              {data.projects.map((project, index) => (
                <View key={index} style={styles.projectBox}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.description}>{project.description}</Text>
                  <View style={styles.projectTechRow}>
                    {project.technologies.map((tech, i) => (
                      <Text key={i} style={styles.techPill}>{tech}</Text>
                    ))}
                  </View>
                  {project.link && <Text style={styles.projectLink}>{project.link}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.languages}</Text>
              <View style={styles.languageGrid}>
                {data.languages.map((lang, index) => (
                  <View key={index} style={styles.languageBox}>
                    <Text style={styles.languageName}>{lang.name}</Text>
                    <Text style={styles.languageLevel}>{lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
