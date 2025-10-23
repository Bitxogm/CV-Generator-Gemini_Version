import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';

// Using system font (Helvetica) for compatibility with @react-pdf


const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 30,
    color: 'white',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
  },
  content: {
    padding: 25,
  },
  summaryBox: {
    backgroundColor: '#EEF2FF',
    padding: 15,
    borderLeft: '4pt solid #8B5CF6',
    marginBottom: 20,
    borderRadius: 4,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 12,
  },
  experienceTimeline: {
    borderLeft: '2pt solid #D1D5DB',
    paddingLeft: 20,
  },
  experienceItem: {
    marginBottom: 15,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -25,
    top: 0,
    width: 10,
    height: 10,
    backgroundColor: '#3B82F6',
    borderRadius: '50%',
  },
  experienceBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 4,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  company: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dateBox: {
    fontSize: 8,
    backgroundColor: 'white',
    padding: '3pt 8pt',
    borderRadius: 3,
    color: '#6b7280',
    marginBottom: 6,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  educationGrid: {
    gap: 10,
  },
  educationBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  institution: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: '6pt 12pt',
    borderRadius: 12,
    fontSize: 9,
    fontWeight: 'bold',
  },
  projectBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 4,
    borderLeft: '4pt solid #8B5CF6',
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  techPill: {
    backgroundColor: '#EEF2FF',
    color: '#8B5CF6',
    padding: '3pt 8pt',
    borderRadius: 8,
    fontSize: 8,
    fontWeight: 'bold',
    marginRight: 4,
    marginTop: 4,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  languageBox: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 4,
    minWidth: '45%',
  },
  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  languageLevel: {
    fontSize: 8,
    color: '#3B82F6',
  },
});

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
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
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

        <View style={styles.content}>
          {/* Summary */}
          {data.summary && (
            <View style={styles.summaryBox}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 6, color: '#8B5CF6' }}>
                💼 {t.professionalSummary}
              </Text>
              <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{data.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚀 {t.experience}</Text>
              <View style={styles.experienceTimeline}>
                {data.experience.map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceBox}>
                      <Text style={styles.jobTitle}>{exp.position}</Text>
                      <Text style={styles.company}>{exp.company} • {exp.location}</Text>
                      <Text style={styles.dateBox}>
                        {exp.startDate} - {exp.current ? t.present : exp.endDate}
                      </Text>
                      <Text style={styles.description}>{exp.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎓 {t.education}</Text>
              <View style={styles.educationGrid}>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.educationBox}>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.institution}>{edu.institution} • {edu.field}</Text>
                    <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 3 }}>
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
              <Text style={styles.sectionTitle}>⚡ {t.skills}</Text>
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
              <Text style={styles.sectionTitle}>⚡ {t.softSkills}</Text>
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
              <Text style={styles.sectionTitle}>💡 {t.projects}</Text>
              {data.projects.map((project, index) => (
                <View key={index} style={styles.projectBox}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.description}>{project.description}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                    {project.technologies.map((tech, i) => (
                      <Text key={i} style={styles.techPill}>{tech}</Text>
                    ))}
                  </View>
                  {project.link && (
                    <Text style={{ fontSize: 8, color: '#3B82F6', marginTop: 4 }}>
                      🔗 {project.link}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🌍 {t.languages}</Text>
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
