import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';

// Using system font (Helvetica) for compatibility with @react-pdf


const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1a1a1a',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 20,
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 8,
  },
  content: {
    padding: 15,
  },
  summaryBox: {
    backgroundColor: '#EEF2FF',
    padding: 10,
    borderLeft: '3pt solid #8B5CF6',
    marginBottom: 10,
    borderRadius: 3,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 6,
  },
  experienceTimeline: {
    borderLeft: '2pt solid #D1D5DB',
    paddingLeft: 15,
  },
  experienceItem: {
    marginBottom: 8,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -20,
    top: 0,
    width: 8,
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: '50%',
  },
  experienceBox: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 3,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  company: {
    fontSize: 9,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateBox: {
    fontSize: 7,
    backgroundColor: 'white',
    padding: '2pt 6pt',
    borderRadius: 2,
    color: '#6b7280',
    marginBottom: 4,
  },
  description: {
    fontSize: 8,
    lineHeight: 1.3,
  },
  educationGrid: {
    gap: 6,
  },
  educationBox: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 3,
    marginBottom: 6,
  },
  degree: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  institution: {
    fontSize: 9,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillPill: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: '4pt 8pt',
    borderRadius: 10,
    fontSize: 8,
    fontWeight: 'bold',
  },
  projectBox: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 3,
    borderLeft: '3pt solid #8B5CF6',
    marginBottom: 6,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  techPill: {
    backgroundColor: '#EEF2FF',
    color: '#8B5CF6',
    padding: '2pt 6pt',
    borderRadius: 6,
    fontSize: 7,
    fontWeight: 'bold',
    marginRight: 3,
    marginTop: 3,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageBox: {
    backgroundColor: '#F9FAFB',
    padding: 6,
    borderRadius: 3,
    minWidth: '45%',
  },
  languageName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  languageLevel: {
    fontSize: 7,
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
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 4, color: '#8B5CF6' }}>
                {t.professionalSummary}
              </Text>
              <Text style={{ fontSize: 8, lineHeight: 1.3 }}>{data.summary}</Text>
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
              <Text style={styles.sectionTitle}>{t.education}</Text>
              <View style={styles.educationGrid}>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.educationBox}>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.institution}>{edu.institution} • {edu.field}</Text>
                    <Text style={{ fontSize: 7, color: '#6b7280', marginTop: 2 }}>
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
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                    {project.technologies.map((tech, i) => (
                      <Text key={i} style={styles.techPill}>{tech}</Text>
                    ))}
                  </View>
                  {project.link && (
                    <Text style={{ fontSize: 7, color: '#3B82F6', marginTop: 3 }}>
                      {project.link}
                    </Text>
                  )}
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
