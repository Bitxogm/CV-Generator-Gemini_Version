import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import { History, FileDown, BarChart, Loader2, Sparkles, Trash2, Upload, User } from 'lucide-react';
import { CVData, TemplateType, ATSAnalysis } from '@/entities/cv/model';
import { SavedCVBackend } from '@/entities/cv/api';
import { StorageService } from '@/shared/services';
import { victorData } from '@/app/constants';
import { celebrateDownload } from '@/shared/lib';
import { useLanguage } from '@/app/providers';
import { CVForm } from '@/features/cv-create';
import { AIAssistant } from '@/features/ai-assistant';
import { CVPreview, ModernPDF, ProfessionalPDF, CreativePDF, ATSPDF } from '@/features/cv-preview';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { LanguageSelector } from '@/shared/ui';
import { useCVDashboard } from '../model/useCVDashboard';
import { useATSAnalysis } from '../model/useATSAnalysis';
import { CVList } from './components/CVList';

const initialCVData: CVData = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '', photo: '' },
  summary: '',
  experience: [{ id: '1', company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }],
  education: [{ id: '1', institution: '', degree: '', field: '', startDate: '', endDate: '', current: false }],
  skills: [],
  softSkills: [],
  projects: [{ id: '1', name: '', description: '', technologies: [], link: '' }],
  languages: [],
};

export function CVDashboard() {
  const { t, language } = useLanguage();

  const { savedCVs, currentCVId, setCurrentCVId, createCV, updateCV, deleteCV } = useCVDashboard(t);
  const { atsAnalysis, isAnalyzing, analyzeCV } = useATSAnalysis(t);

  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = StorageService.loadCVData();
    if (saved) return saved;
    return import.meta.env.DEV ? victorData : initialCVData;
  });
  const [templateType, setTemplateType] = useState<TemplateType>('modern');
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const previousCVDataRef = useRef<string>();

  useEffect(() => {
    const current = JSON.stringify(cvData);
    if (previousCVDataRef.current === current) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      StorageService.saveCVData(cvData);
      previousCVDataRef.current = current;
      console.log('💾 CV auto-guardado');
    }, 2000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [cvData]);

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Error desconocido';

  // ── Foto de perfil ─────────────────────────────────────────────────────────
  const compressImage = (file: File, maxPx = 400, quality = 0.82): Promise<string> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen')); };
      img.src = url;
    });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen (JPG, PNG, WebP...)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen no debe superar 10MB');
      return;
    }
    try {
      const compressed = await compressImage(file);
      setCvData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, photo: compressed } }));
      toast.success('Foto cargada correctamente');
    } catch {
      toast.error('Error al procesar la imagen');
    }
  };

  const handleRemovePhoto = () => {
    setCvData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, photo: '' } }));
    toast.success('Foto eliminada');
  };

  // ── Guardar CV ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (currentCVId) {
      if (!window.confirm('¿Actualizar el CV actual?')) return;
      await updateCV(currentCVId, cvData);
    } else {
      const cvName = window.prompt(t('notifications.cvNamePrompt'));
      if (!cvName) return;
      await createCV(cvName, cvData);
    }
  };

  // ── Descargar PDF ──────────────────────────────────────────────────────────
  const handleDownload = async (format: 'visual' | 'ats' = 'visual', selectedTemplate: TemplateType = templateType) => {
    try {
      const getVisualPdf = (tpl: TemplateType) => {
        switch (tpl) {
          case 'professional': return <ProfessionalPDF data={cvData} language={language} />;
          case 'creative': return <CreativePDF data={cvData} language={language} />;
          default: return <ModernPDF data={cvData} language={language} />;
        }
      };
      const pdfDoc = format === 'ats' ? <ATSPDF data={cvData} language={language} /> : getVisualPdf(selectedTemplate);
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

  // ── Historial ──────────────────────────────────────────────────────────────
  const handleLoadCV = (cv: SavedCVBackend) => {
    setCvData(cv.cvData);
    setCurrentCVId(cv.id);
    setShowHistory(false);
    toast.success(t('notifications.cvLoaded', { name: cv.title }));
  };

  const handleDeleteCV = async (id: string, title: string) => {
    if (window.confirm(`¿Eliminar "${title}"?`)) {
      await deleteCV(id);
    }
  };

  const handleNewCV = () => {
    if (currentCVId) {
      if (!window.confirm('¿Crear un nuevo CV? Los cambios no guardados se perderán.')) return;
    }
    setCvData(initialCVData);
    setCurrentCVId(null);
    toast.success('Nuevo CV iniciado');
  };

  return (
    <>
      {/* ── Sticky header ────────────────────────────────────────────────── */}
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
              {currentCVId && (
                <Button variant="outline" onClick={handleNewCV}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Nuevo CV
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowHistory(true)}>
                <History className="w-4 h-4 mr-2" />
                {t('tabs.history')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Contenido principal ───────────────────────────────────────────── */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Foto de perfil */}
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
                  <img src={cvData.personalInfo.photo} alt="Foto de perfil" className="w-full h-full object-cover" />
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
                  <input id="photo-upload" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
                </label>
                {cvData.personalInfo.photo && (
                  <Button variant="ghost" size="sm" onClick={handleRemovePhoto} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3 mr-2" />
                    Eliminar foto
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">JPG, PNG o WebP · máx. 10MB · se comprime automáticamente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs principales */}
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
              currentCVId={currentCVId}
            />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIAssistant
              cvData={cvData}
              onApplySuggestions={(suggestions) => {
                if (suggestions.summary) setCvData(prev => ({ ...prev, summary: suggestions.summary! }));
                if (suggestions.skills?.length) {
                  setCvData(prev => ({ ...prev, skills: [...new Set([...prev.skills, ...suggestions.skills!])] }));
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Modal Preview ─────────────────────────────────────────────────── */}
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
                    <Button onClick={() => analyzeCV(currentCVId)} disabled={isAnalyzing}>
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

      {/* ── Modal Historial ───────────────────────────────────────────────── */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('history.title')}</DialogTitle>
          </DialogHeader>
          <CVList savedCVs={savedCVs} onLoad={handleLoadCV} onDelete={handleDeleteCV} />
        </DialogContent>
      </Dialog>
    </>
  );
}
