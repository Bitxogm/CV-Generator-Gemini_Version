import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CVData, TemplateType, ATSAnalysis } from '@/types/cv';
import { CVForm } from '@/components/cv/CVForm';
import { CVPreview } from '@/components/cv/preview/CVPreview';
import { ModernPDF } from '@/components/cv/pdf/ModernPDF';
import { ProfessionalPDF } from '@/components/cv/pdf/ProfessionalPDF';
import { CreativePDF } from '@/components/cv/pdf/CreativePDF';
import { ATSPDF } from '@/components/cv/pdf/ATSPDF';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, FileDown, BarChart, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/cv/AIAssistant';
import { celebrateDownload } from '@/lib/confetti';
import { pdf } from '@react-pdf/renderer';
// ✅ Importar servicios de localStorage y Gemini
import StorageService from '@/services/storageService';
import { GoogleGenerativeAI } from "@google/generative-ai";

const initialCVData: CVData = {
  personalInfo: {
    fullName: 'Victor Manuel González Moreno',
    email: 'vmmoreno1999@gmail.com',
    phone: '+34 622 696 266',
    location: 'Barakaldo, Vizcaya',
    linkedin: 'https://www.linkedin.com/in/victor-manuel-gonzalez-moreno/',
    github: 'https://github.com/Bitxogm',
    website: 'https://myreactportfolio1944.web.app/',
  },
  summary: 'Profesional en transición hacia desarrollo web con 8+ años de experiencia comprobada en liderazgo de equipos, gestión de proyectos complejos y resolución de problemas bajo presión. Especializado en desarrollo full-stack con enfoque en integración de Inteligencia Artificial (Claude, Gemini) aplicando técnicas de Prompt Engineering y RAG. Apasionado por crear soluciones web escalables, innovadoras y centradas en el usuario.',
  experience: [
    {
      id: '1',
      company: 'KeepCoding Web Bootcamp',
      position: 'Desarrollador Web Full-Stack (Formación Intensiva)',
      location: 'Cantabria',
      startDate: '2025',
      endDate: 'Actualidad',
      current: true,
      description: `Programa intensivo de +500 horas enfocado en el desarrollo práctico de aplicaciones web modernas.

Experiencia en:
• Desarrollo de interfaces dinámicas y responsivas con React, TypeScript y TailwindCSS
• Implementación de APIs RESTful con Node.js y Express
• Gestión de bases de datos relacionales (PostgreSQL) y no relacionales (MongoDB)
• Integración de IA: Claude API, Gemini API, Google AI Studio, Prompt Engineering y RAG
• Testing automatizado con Vitest (frontend) y Jest (backend)
• Control de versiones con Git/GitHub y flujos CI/CD
• Despliegue de aplicaciones en Firebase, Render y Vercel
• Python para scripting y automatización`,
    },
    {
      id: '2',
      company: 'Gestamp Try Out',
      position: 'Team Leader / Responsable de Turno y Sección',
      location: 'Barakaldo',
      startDate: '2016',
      endDate: 'Diciembre 2024',
      current: false,
      description: `Team Leader en try-out de troqueles de automoción con gestión de equipos técnicos (10-15 personas) en proyectos internacionales para OEMs premium.

Proyectos destacados:
- Try-out de piezas Clase A (body-side, fender, roof, doors) para Mercedes-Benz, BMW, Audi y Volkswagen
- Campañas en plantas de España, Alemania e India
- Coordinación con ingeniería de cliente bajo deadlines críticos
- Gestión de líneas de producción con cero margen de error

Responsabilidades clave:
- Liderazgo de equipos multidisciplinares bajo presión extrema
- Resolución de problemas técnicos complejos en tiempo real
- Comunicación directa con stakeholders de OEMs premium
- Optimización de procesos y mejora continua
- Coordinación internacional en plantas de cliente`,
    },
  ],
  education: [],
  skills: ['React', 'JavaScript', 'TypeScript', 'Python', 'Git', 'Node.js', 'HTML5', 'CSS3', 'MongoDB'],
  softSkills: ['Liderazgo de equipos', 'Comunicación efectiva', 'Gestión de proyectos', 'Colaboración en equipo'],
  projects: [
    {
      id: '1',
      name: 'AgentLogic AI - Tutor Inteligente de Programación',
      description: 'Plataforma educativa full-stack con múltiples módulos: generación automática de código con IA, chat interactivo para tutorías personalizadas, visualización de algoritmos con diagramas de flujo, y sistema de gestión de ejercicios.',
      technologies: ['Firebase v2', 'MongoDB Atlas', 'Gemini AI', 'TypeScript'],
      link: 'https://new-logic-agent-git-dev-bitxejos-projects.vercel.app/',
    },
    {
      id: '2',
      name: 'Asistente de Refactorización con IA',
      description: 'Herramienta que analiza código multilenguaje y sugiere mejoras utilizando la API de Gemini, ayudando a los desarrolladores a escribir código más limpio y mantenible.',
      technologies: ['Node.js', 'React + TypeScript', 'Gemini API', 'REST'],
      link: 'https://new-code-ai-assistant.vercel.app/',
    },
  ],
  languages: [],
};

export default function Index() {
  const { t, language } = useLanguage();
  
  // ✅ Cargar CV desde localStorage solo una vez al montar
  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = StorageService.loadCVData();
    return saved || initialCVData;
  });
  
  const [templateType, setTemplateType] = useState<TemplateType>('modern');
  const [showPreview, setShowPreview] = useState(false);
  const [savedCVs, setSavedCVs] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ✅ CORREGIDO: Auto-guardar con ref para evitar loop infinito
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousCVDataRef = useRef<string>();

  useEffect(() => {
    // Serializar para comparar
    const currentCVData = JSON.stringify(cvData);
    
    // Solo guardar si cambió
    if (previousCVDataRef.current === currentCVData) {
      return;
    }

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear nuevo timeout
    timeoutRef.current = setTimeout(() => {
      StorageService.saveCVData(cvData);
      previousCVDataRef.current = currentCVData;
      console.log('💾 CV auto-guardado');
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cvData]);

  // Cargar historial al montar
  useEffect(() => {
    loadSavedCVs();
  }, []);

  const loadSavedCVs = () => {
    const history = StorageService.loadCVHistory();
    setSavedCVs(history);
  };

  const handleSave = () => {
    try {
      const cvName = prompt(t('notifications.cvNamePrompt'));
      if (!cvName) return;

      const success = StorageService.saveCVVersion(cvData, cvName);
      
      if (success) {
        toast.success(t('notifications.cvSaved'));
        loadSavedCVs();
      } else {
        toast.error(t('notifications.errorSaving'));
      }
    } catch (error: any) {
      toast.error(t('notifications.errorSaving'));
      console.error(error);
    }
  };

  const handleDownload = async (format: 'visual' | 'ats' = 'visual') => {
    try {
      let pdfDoc;
      if (format === 'ats') {
        pdfDoc = <ATSPDF data={cvData} language={language} />;
      } else {
        const templates = { modern: ModernPDF, professional: ProfessionalPDF, creative: CreativePDF };
        const Template = templates[templateType];
        pdfDoc = <Template data={cvData} language={language} />;
      }
      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${cvData.personalInfo.fullName || 'curriculum'}_${format}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      const formatLabel = format === 'ats' ? 'ATS' : 'visual';
      toast.success(t('notifications.downloadSuccess', { format: formatLabel }));
      celebrateDownload();
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast.error(`${t('notifications.downloadError')}: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleAnalyzeATS = async () => {
    setIsAnalyzing(true);
    try {
      console.log('🔍 Analizando CV para ATS con Gemini...');

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
Eres un experto en sistemas ATS (Applicant Tracking Systems). Analiza este CV y proporciona un análisis detallado.

**CV:**
${JSON.stringify(cvData, null, 2)}

**Instrucciones:**
1. Asigna una puntuación de compatibilidad ATS (0-100)
2. Identifica palabras clave encontradas
3. Identifica palabras clave faltantes comunes en CVs técnicos
4. Proporciona sugerencias específicas de mejora
5. Lista fortalezas del CV actual
6. Lista debilidades a mejorar

Devuelve ÚNICAMENTE un JSON válido con esta estructura:
{
  "score": número entre 0 y 100,
  "keywords": {
    "matched": ["palabra1", "palabra2", ...],
    "missing": ["palabra1", "palabra2", ...]
  },
  "suggestions": ["sugerencia 1", "sugerencia 2", ...],
  "strengths": ["fortaleza 1", "fortaleza 2", ...],
  "weaknesses": ["debilidad 1", "debilidad 2", ...]
}

NO incluyas markdown, explicaciones ni texto adicional. SOLO el JSON.
      `.trim();

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const analysis: ATSAnalysis = JSON.parse(text);
      
      setAtsAnalysis(analysis);
      console.log('✅ Análisis ATS completado');
      toast.success(t('notifications.atsCompleted'));

    } catch (error: any) {
      console.error('❌ Error en análisis ATS:', error);
      toast.error(t('notifications.atsError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadCV = (cv: any) => {
    setCvData(cv.data);
    setShowHistory(false);
    toast.success(t('notifications.cvLoaded', { name: cv.name }));
  };

  const deleteCV = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar "${name}"?`)) {
      StorageService.deleteCVVersion(id);
      loadSavedCVs();
      toast.success('CV eliminado');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileDown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">CV Crafter</h1>
                <p className="text-sm text-muted-foreground">
                  {t('common.hello')}, {cvData.personalInfo.fullName}
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <LanguageSelector />
              <Button
                variant="outline"
                onClick={() => setShowHistory(true)}
              >
                <History className="w-4 h-4 mr-2" />
                {t('tabs.history')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cv" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="cv">{t('tabs.editor')}</TabsTrigger>
            <TabsTrigger value="ai-assistant">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('tabs.assistant')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cv">
            <CVForm
              cvData={cvData}
              setCvData={setCvData}
              onPreview={() => setShowPreview(true)}
              onSave={handleSave}
              templateType={templateType}
              setTemplateType={setTemplateType}
            />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIAssistant
              cvData={cvData}
              onApplySuggestions={(suggestions) => {
                if (suggestions.summary) {
                  setCvData(prev => ({ ...prev, summary: suggestions.summary }));
                }
                if (suggestions.skills?.length > 0) {
                  setCvData(prev => ({
                    ...prev,
                    skills: [...new Set([...prev.skills, ...suggestions.skills])]
                  }));
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('preview.title')}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">{t('preview.preview')}</TabsTrigger>
              <TabsTrigger value="ats">{t('preview.ats')}</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="space-y-4">
              <CVPreview data={cvData} template={templateType} language={language} />
              <div className="flex gap-2">
                <Button onClick={() => handleDownload('visual')} className="flex-1">
                  <FileDown className="w-4 h-4 mr-2" />
                  {t(`cv.download${templateType.charAt(0).toUpperCase() + templateType.slice(1)}`)}
                </Button>
                <Button onClick={() => handleDownload('ats')} variant="outline" className="flex-1">
                  <FileDown className="w-4 h-4 mr-2" />
                  {t('cv.downloadAts')}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="ats" className="space-y-4">
              {!atsAnalysis ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Button onClick={handleAnalyzeATS} disabled={isAnalyzing}>
                      {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart className="w-4 h-4 mr-2" />}
                      {t('cv.analyzeWithAI')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('preview.atsScore')}: {atsAnalysis.score}/100</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{t('aiAssistant.strengths')}</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {atsAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('aiAssistant.suggestions')}</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {atsAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('history.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {savedCVs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('history.empty')}
              </p>
            ) : (
              savedCVs.map((cv) => (
                <div
                  key={cv.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{cv.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => loadCV(cv)}
                    >
                      {t('common.load')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCV(cv.id, cv.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}