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
import { History, FileDown, BarChart, Loader2, Sparkles, Trash2, Upload, User } from 'lucide-react';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/cv/AIAssistant';
import { celebrateDownload } from '@/lib/confetti';
import { pdf } from '@react-pdf/renderer';
import StorageService from '@/services/storageService';
import { GoogleGenerativeAI } from "@google/generative-ai";

type SavedCV = ReturnType<typeof StorageService.loadCVHistory>[number];

// ─────────────────────────────────────────────────────────────────────────────
// PLANTILLA VACÍA — se usa en producción para nuevos visitantes.
// ─────────────────────────────────────────────────────────────────────────────
const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    photo: '',
  },
  summary: '',
  experience: [
    {
      id: '1',
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  education: [
    {
      id: '1',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
    },
  ],
  skills: [],
  softSkills: [],
  projects: [
    {
      id: '1',
      name: '',
      description: '',
      technologies: [],
      link: '',
    },
  ],
  languages: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// DATOS DE VICTOR — solo se cargan en entorno local (import.meta.env.DEV)
// y únicamente si localStorage está vacío.
// ─────────────────────────────────────────────────────────────────────────────
const victorData: CVData = {
  personalInfo: {
    fullName: 'Victor Manuel González Moreno',
    email: 'vmmoreno1999@gmail.com',
    phone: '+34 622 696 266',
    location: 'Barakaldo, Vizcaya',
    linkedin: 'linkedin.com/in/victor-manuel-gonzalez-moreno',
    github: 'github.com/Bitxogm',
    website: 'https://bitxodev.com',
    photo: '',
  },

  summary:
    '• Desarrollador Web Full-Stack con proyectos reales en producción integrando IA (Claude API, Gemini, RAG)\n' +
    '• Graduado KeepCoding 2025 · Stack: React, Next.js, Node.js, PostgreSQL, Docker y AWS\n' +
    '• Background de 8+ años en gestión de proyectos industriales internacionales — madurez, rigor y trabajo bajo presión\n' +
    '• Inglés B2 · Incorporación inmediata',

  experience: [
    {
      id: '1',
      company: 'Gestamp',
      position: 'Team Leader / Gestor de Proyectos Internacionales',
      location: 'Barakaldo',
      startDate: '2016',
      endDate: '2024',
      current: false,
      description:
        'Gestión de proyectos de alta exigencia para OEMs premium (Mercedes-Benz, BMW, Audi, VW) ' +
        'con equipos técnicos de +15 personas a nivel internacional.\n\n' +
        '• Coordinación de ciclos de entrega en España, Alemania e India con deadlines inamovibles.\n' +
        '• Resolución de bloqueos técnicos críticos en tiempo real bajo presión extrema.\n' +
        '• Interlocución directa con ingeniería de clientes premium (client-facing).\n' +
        '• Diseño e implementación de procesos de mejora continua con margen de error cero.',
    },
  ],

  education: [
    {
      id: '1',
      institution: 'KeepCoding Web Bootcamp',
      degree: 'Desarrollo Web Full-Stack',
      field: 'Bootcamp intensivo (+800h) · Cantabria',
      startDate: '2025',
      endDate: '2026',
      current: false,
    },
    {
      id: '2',
      institution: 'Instituto Nicolás Larburu',
      degree: 'Grado Superior — Fabricación y Ajuste de Matricería',
      field: 'Estudios Técnicos · Barakaldo',
      startDate: '',
      endDate: '',
      current: false,
    },
  ],

  skills: [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Express',
    'Python',
    'PostgreSQL',
    'MongoDB',
    'Prisma',
    'Docker',
    'AWS',
    'Git',
    'HTML5',
    'CSS3',
    'TailwindCSS',
    'Responsive Design',
  ],

  softSkills: [
    'Gestión de proyectos complejos',
    'Resolución de problemas críticos',
    'Comunicación efectiva (client-facing)',
    'Trabajo en equipo',
    'Atención al detalle',
    'Autonomía y autoaprendizaje',
    'Agile / Scrum',
  ],

  projects: [
    {
      id: '1',
      name: 'TestLab AI — Generador y Ejecutor de Tests con IA',
      description:
        'Monorepo full-stack para generación y ejecución automática de tests.\n' +
        '• Arquitectura hexagonal en backend (Express) con sandboxes Docker aislados.\n' +
        '• Almacenamiento dual PostgreSQL/Prisma + MongoDB y WebSockets en tiempo real.',
      technologies: ['Next.js', 'Express', 'Gemini API', 'Docker', 'Socket.io', 'PostgreSQL', 'Prisma', 'MongoDB'],
      link: '',
    },
    {
      id: '2',
      name: 'AgentLogic AI — Tutor Inteligente de Programación',
      description:
        'Plataforma educativa interactiva con chat tutor personalizado.\n' +
        '• Módulos de generación de código IA y visualización algorítmica.\n' +
        '• Gestión de usuarios y métricas bajo Firebase / MongoDB Atlas.',
      technologies: ['Firebase', 'MongoDB Atlas', 'Gemini AI', 'TypeScript'],
      link: 'https://agentlogic.bitxodev.com/',
    },
    {
      id: '3',
      name: 'Asistente de Refactorización con IA',
      description:
        'Herramienta orientada a clean-code y calidad de software.\n' +
        '• Analiza código multilenguaje y sugiere refactorizaciones con Gemini API.\n' +
        '• Arquitectura REST desacoplada con frontend React y backend Node.js.',
      technologies: ['Node.js', 'React', 'TypeScript', 'Gemini API', 'REST'],
      link: 'https://codeai.bitxodev.com/',
    },
    {
      id: '4',
      name: 'CV Crafter — Generador de CVs Profesionales',
      description:
        'SaaS frontend para creación de CVs con plantillas múltiples.\n' +
        '• Análisis ATS potenciado por IA (Gemini) con puntuación y sugerencias.\n' +
        '• Manejo avanzado de estado en React y renderizado de PDF en cliente.',
      technologies: ['React', 'TypeScript', 'Vite', 'Gemini API', 'TailwindCSS'],
      link: 'https://cvgenerator.bitxodev.com/',
    },
  ],

  languages: [],
};

// ─────────────────────────────────────────────────────────────────────────────
export default function Index() {
  const { t, language } = useLanguage();

  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = StorageService.loadCVData();
    if (saved) return saved;
    return import.meta.env.DEV ? victorData : initialCVData;
  });

  const [templateType, setTemplateType] = useState<TemplateType>('modern');
  const [showPreview, setShowPreview] = useState(false);
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const previousCVDataRef = useRef<string>();

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return 'Error desconocido';
  };

  useEffect(() => {
    const currentCVData = JSON.stringify(cvData);
    if (previousCVDataRef.current === currentCVData) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      StorageService.saveCVData(cvData);
      previousCVDataRef.current = currentCVData;
      console.log('💾 CV auto-guardado');
    }, 2000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [cvData]);

  useEffect(() => {
    loadSavedCVs();
  }, []);

  const loadSavedCVs = () => {
    const history = StorageService.loadCVHistory();
    setSavedCVs(history);
  };

  // ─── Foto de perfil ────────────────────────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen (JPG, PNG, WebP...)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCvData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, photo: reader.result as string },
      }));
      toast.success('Foto cargada correctamente');
    };
    reader.onerror = () => toast.error('Error al leer la imagen');
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, photo: '' },
    }));
    toast.success('Foto eliminada');
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
    } catch (error: unknown) {
      toast.error(t('notifications.errorSaving'));
      console.error(error);
    }
  };

  const handleDownload = async (
    format: 'visual' | 'ats' = 'visual',
    selectedTemplate: TemplateType = templateType,
  ) => {
    try {
      const getVisualPdf = (t: TemplateType) => {
        switch (t) {
          case 'professional': return <ProfessionalPDF data={cvData} language={language} />;
          case 'creative':     return <CreativePDF data={cvData} language={language} />;
          default:             return <ModernPDF data={cvData} language={language} />;
        }
      };
      const pdfDoc = format === 'ats'
        ? <ATSPDF data={cvData} language={language} />
        : getVisualPdf(selectedTemplate);
      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileVariant = format === 'ats' ? 'ats' : selectedTemplate;
      link.download = `CV_${cvData.personalInfo.fullName || 'curriculum'}_${fileVariant}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(t('notifications.downloadSuccess', { format: format === 'ats' ? 'ATS' : fileVariant }));
      celebrateDownload();
    } catch (error: unknown) {
      console.error('Error downloading PDF:', error);
      toast.error(`${t('notifications.downloadError')}: ${getErrorMessage(error)}`);
    }
  };

  const handleAnalyzeATS = async () => {
    setIsAnalyzing(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `
Eres un experto en sistemas ATS (Applicant Tracking Systems). Analiza este CV y proporciona un análisis detallado.

**CV:**
${JSON.stringify(cvData, null, 2)}

Devuelve ÚNICAMENTE un JSON válido con esta estructura:
{
  "score": número entre 0 y 100,
  "keywords": { "matched": ["palabra1"], "missing": ["palabra1"] },
  "suggestions": ["sugerencia 1"],
  "strengths": ["fortaleza 1"],
  "weaknesses": ["debilidad 1"]
}

NO incluyas markdown, explicaciones ni texto adicional. SOLO el JSON.
      `.trim();
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const analysis: ATSAnalysis = JSON.parse(text);
      setAtsAnalysis(analysis);
      toast.success(t('notifications.atsCompleted'));
    } catch (error: unknown) {
      console.error('❌ Error en análisis ATS:', error);
      toast.error(t('notifications.atsError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadCV = (cv: SavedCV) => {
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

      {/* ── Header ────────────────────────────────────────────────────────── */}
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
                  {cvData.personalInfo.fullName
                    ? `${t('common.hello')}, ${cvData.personalInfo.fullName}`
                    : 'Tu CV profesional, listo para destacar'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <LanguageSelector />
              <Button variant="outline" onClick={() => setShowHistory(true)}>
                <History className="w-4 h-4 mr-2" />
                {t('tabs.history')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">

        {/* ── Foto de perfil ──────────────────────────────────────────────── */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Foto de perfil{' '}
              <span className="text-muted-foreground font-normal text-sm">
                (opcional — recomendada en España)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 overflow-hidden flex items-center justify-center bg-muted flex-shrink-0">
                {cvData.personalInfo.photo ? (
                  <img src={cvData.personalInfo.photo} alt="Foto de perfil"
                    className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-3 h-3 mr-2" />
                      {cvData.personalInfo.photo ? 'Cambiar foto' : 'Subir foto'}
                    </span>
                  </Button>
                  <input id="photo-upload" type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden" onChange={handlePhotoUpload} />
                </label>
                {cvData.personalInfo.photo && (
                  <Button variant="ghost" size="sm" onClick={handleRemovePhoto}
                    className="text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3 mr-2" />
                    Eliminar foto
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  JPG, PNG o WebP · máx. 2MB · se guarda en local
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Tabs principales ────────────────────────────────────────────── */}
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
                    skills: [...new Set([...prev.skills, ...suggestions.skills])],
                  }));
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Modal Preview ──────────────────────────────────────────────────── */}
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
                <Button onClick={() => handleDownload('visual', templateType)} className="flex-1">
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
                      {isAnalyzing
                        ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        : <BarChart className="w-4 h-4 mr-2" />}
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

      {/* ── Modal Historial ────────────────────────────────────────────────── */}
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
                <div key={cv.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{cv.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => loadCV(cv)}>
                      {t('common.load')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteCV(cv.id, cv.name)}>
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