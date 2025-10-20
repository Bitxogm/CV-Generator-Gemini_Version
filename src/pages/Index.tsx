import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
import { LogOut, History, FileDown, Eye, BarChart, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/cv/AIAssistant';
import { supabase } from '@/integrations/supabase/client';
import { celebrateDownload } from '@/lib/confetti';
import { pdf } from '@react-pdf/renderer';

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
  summary: 'Desarrollador en transición con una sólida experiencia de más de 8 años en liderazgo de equipos y gestión de proyectos. Apasionado por crear soluciones web innovadoras y centradas en el usuario con tecnologías modernas, especializándome en el desarrollo full-stack con React, Node.js y TypeScript.',
  experience: [
    {
      id: '1',
      company: 'KeepCoding Web Bootcamp',
      position: 'Desarrollador Web Full-Stack (Formación Intensiva)',
      location: 'Madrid',
      startDate: '2024',
      endDate: 'Actualidad',
      current: true,
      description: 'Programa intensivo de +500 horas enfocado en el desarrollo práctico de aplicaciones web modernas. Desarrollo de proyectos con React, Python, JavaScript, Node.js, HTML5/CSS3 y SQL. Colaboración en equipo mediante Pair Programming y metodologías ágiles para un proyecto final.',
    },
    {
      id: '2',
      company: 'Gestamp Try Out',
      position: 'Responsable de Turno y Sección',
      location: 'Barakaldo',
      startDate: '2016',
      endDate: '2024',
      current: false,
      description: 'Lideré equipos multidisciplinares, gestioné proyectos técnicos, optimicé procesos y coordiné operaciones a nivel internacional. Experiencia en la resolución de problemas complejos y en la entrega de soluciones bajo presión.',
    },
  ],
  education: [],
  skills: ['React', 'JavaScript', 'TypeScript', 'Python', 'Git', 'Node.js', 'HTML5', 'CSS3', 'SQL', 'Liderazgo de equipos', 'Resolución de problemas complejos', 'Gestión de proyectos', 'Colaboración en equipo'],
  projects: [
    {
      id: '1',
      name: 'Asistente de Refactorización con IA',
      description: 'Herramienta que analiza código multilenguaje y sugiere mejoras utilizando la API de Gemini, ayudando a los desarrolladores a escribir código más limpio y mantenible.',
      technologies: ['Node.js', 'React + TypeScript', 'Gemini API', 'REST'],
      link: 'github.com/v-gonzalez-moreno/refactor-ai',
    },
    {
      id: '2',
      name: 'Portfolio Interactivo 3D',
      description: 'Portfolio personal con animaciones 3D inmersivas creadas con Three.js para mostrar proyectos y habilidades técnicas de una forma atractiva.',
      technologies: ['React', 'Three.js', 'CSS3', 'JavaScript'],
      link: 'github.com/v-gonzalez-moreno/portfolio-3d',
    },
  ],
  languages: [],
};

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [templateType, setTemplateType] = useState<TemplateType>('modern');
  const [showPreview, setShowPreview] = useState(false);
  const [savedCVs, setSavedCVs] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      loadSavedCVs();
    }
  }, [user]);

  const loadSavedCVs = async () => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSavedCVs(data || []);
    } catch (error) {
      console.error('Error loading CVs:', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar');
      return;
    }

    try {
      const cvName = prompt('Nombre para este CV:');
      if (!cvName) return;

      const { error } = await supabase.from('cvs').insert([{
        user_id: user.id,
        name: cvName,
        data: cvData as any,
        template_type: templateType,
      }]);

      if (error) throw error;

      toast.success('CV guardado exitosamente');
      loadSavedCVs();
    } catch (error: any) {
      toast.error('Error al guardar CV');
      console.error(error);
    }
  };

  const handleDownload = async (format: 'visual' | 'ats' = 'visual') => {
    try {
      let pdfDoc;
      if (format === 'ats') {
        pdfDoc = <ATSPDF data={cvData} />;
      } else {
        const templates = { modern: ModernPDF, professional: ProfessionalPDF, creative: CreativePDF };
        const Template = templates[templateType];
        pdfDoc = <Template data={cvData} />;
      }
      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${cvData.personalInfo.fullName || 'curriculum'}_${format}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`CV descargado en formato ${format === 'ats' ? 'ATS' : 'visual'}!`);
      celebrateDownload();
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast.error(`Error al descargar el CV: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleAnalyzeATS = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-ats', { body: { cvData } });
      if (error) throw error;
      if (data?.analysis) {
        setAtsAnalysis(data.analysis);
        toast.success('Análisis ATS completado');
      }
    } catch (error) {
      toast.error('Error al analizar CV');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadCV = (cv: any) => {
    setCvData(cv.data);
    setTemplateType(cv.template_type);
    setShowHistory(false);
    toast.success(`CV "${cv.name}" cargado`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
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
                  Hola, {user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowHistory(true)}
              >
                <History className="w-4 h-4 mr-2" />
                Historial
              </Button>
              <Button
                variant="outline"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cv" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="cv">Editor de CV</TabsTrigger>
            <TabsTrigger value="ai-assistant">
              <Sparkles className="w-4 h-4 mr-2" />
              Asistente IA
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

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vista Previa del CV</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Vista Previa</TabsTrigger>
              <TabsTrigger value="ats">Análisis ATS</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="space-y-4">
              <CVPreview data={cvData} template={templateType} />
              <div className="flex gap-2">
                <Button onClick={() => handleDownload('visual')} className="flex-1">
                  <FileDown className="w-4 h-4 mr-2" />
                  Descargar Visual
                </Button>
                <Button onClick={() => handleDownload('ats')} variant="outline" className="flex-1">
                  <FileDown className="w-4 h-4 mr-2" />
                  Descargar ATS
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="ats" className="space-y-4">
              {!atsAnalysis ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Button onClick={handleAnalyzeATS} disabled={isAnalyzing}>
                      {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart className="w-4 h-4 mr-2" />}
                      Analizar con IA
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Score ATS: {atsAnalysis.score}/100</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Fortalezas</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {atsAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Sugerencias</h4>
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

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historial de CVs</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {savedCVs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tienes CVs guardados aún
              </p>
            ) : (
              savedCVs.map((cv) => (
                <div
                  key={cv.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div>
                    <p className="font-medium">{cv.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cv.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => loadCV(cv)}
                  >
                    Cargar
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
