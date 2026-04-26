import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CVData } from '@/entities/cv/model';
import { getPdfDensity, getPdfScales } from './pdfDensity';

// Using system font (Helvetica) for compatibility with @react-pdf

const createStyles = (fontScale: number, spacingScale: number) => {
  const f = (value: number) => value * fontScale;
  const s = (value: number) => value * spacingScale;

  return StyleSheet.create({
    page: {
      flexDirection: 'row',
      fontFamily: 'Helvetica',
      fontSize: f(9),
      color: '#1a1a1a',
    },
    sidebar: {
      width: '35%',
      backgroundColor: '#f3f4f6',
      padding: s(25),
    },
    main: {
      width: '65%',
      padding: s(25),
    },
    name: {
      fontSize: f(18),
      fontWeight: 'bold',
      marginBottom: s(20),
      color: '#1a1a1a',
    },
    sidebarSection: {
      marginBottom: s(20),
    },
    sidebarTitle: {
      fontSize: f(10),
      fontWeight: 'bold',
      color: '#3B82F6',
      marginBottom: s(10),
      textTransform: 'uppercase',
      letterSpacing: f(0.5),
    },
    contactItem: {
      fontSize: f(8),
      marginBottom: s(6),
      lineHeight: f(1.3),
    },
    skillItem: {
      fontSize: f(8),
      marginBottom: s(4),
    },
    mainSection: {
      marginBottom: s(12),
    },
    mainTitle: {
      fontSize: f(14),
      fontWeight: 'bold',
      color: '#3B82F6',
      marginBottom: s(10),
      paddingBottom: s(5),
      borderBottom: '2pt solid #3B82F6',
    },
    summary: {
      fontSize: f(9),
      lineHeight: f(1.5),
    },
    experienceItem: {
      marginBottom: s(12),
    },
    jobTitle: {
      fontSize: f(10),
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: s(2),
    },
    company: {
      fontSize: f(9),
      color: '#3B82F6',
      fontWeight: 'bold',
      marginBottom: s(2),
    },
    dateLocation: {
      fontSize: f(8),
      color: '#6b7280',
      marginBottom: s(4),
    },
    description: {
      fontSize: f(9),
      lineHeight: f(1.4),
    },
    educationItem: {
      marginBottom: s(10),
    },
    degree: {
      fontSize: f(10),
      fontWeight: 'bold',
      marginBottom: s(2),
    },
    projectItem: {
      marginBottom: s(10),
    },
    projectName: {
      fontSize: f(10),
      fontWeight: 'bold',
      marginBottom: s(2),
    },
    techStack: {
      fontSize: f(8),
      color: '#6b7280',
      marginTop: s(2),
    },
    languageItem: {
      marginBottom: s(6),
    },
    languageName: {
      fontSize: f(9),
      fontWeight: 'bold',
    },
    languageLevel: {
      fontSize: f(8),
      color: '#6b7280',
    },
    summaryTitle: {
      fontSize: f(14),
      fontWeight: 'bold',
      color: '#3B82F6',
      marginBottom: s(8),
      textAlign: 'center',
    },
    summaryIntro: {
      fontSize: f(9),
      lineHeight: f(1.4),
      marginBottom: s(5),
    },
    summaryBulletHeader: {
      fontSize: f(9),
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: s(3),
      marginTop: s(2),
    },
    bulletItem: {
      fontSize: f(8),
      lineHeight: f(1.3),
      marginBottom: s(2),
      paddingLeft: s(8),
    },
  });
};

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
  const density = getPdfDensity(data);
  const { fontScale, spacingScale } = getPdfScales(density);
  const styles = createStyles(fontScale, spacingScale);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {data.personalInfo.photo && (
            <Image
              src={data.personalInfo.photo}
              style={{ width: spacingScale * 70, height: spacingScale * 70, borderRadius: spacingScale * 35, alignSelf: 'center', marginBottom: spacingScale * 10 }}
            />
          )}
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>{t.contact}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
            {data.personalInfo.linkedin && (
              <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>
            )}
            {data.personalInfo.website && (
              <Text style={styles.contactItem}>{data.personalInfo.website}</Text>
            )}
            {data.personalInfo.github && (
              <Text style={styles.contactItem}>{data.personalInfo.github}</Text>
            )}
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
              <Text style={styles.mainTitle}>{t.professionalSummary}</Text>
              {data.summary.split('\n').filter(l => l.trim()).map((line, i) => (
                <Text key={i} style={styles.bulletItem}>{line.startsWith('•') ? line : `• ${line}`}</Text>
              ))}
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
