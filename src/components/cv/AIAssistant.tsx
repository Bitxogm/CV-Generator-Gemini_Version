import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Loader2, FileText, CheckCircle2, Download, Copy, Eye, Edit2 } from 'lucide-react';
import { CVData } from '@/types/cv';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { generateCoverLetterPDF, generateCoverLetterPreview, CoverLetterFormat } from '@/utils/pdfGenerator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AIAssistantProps {
  cvData: CVData;
  onApplySuggestions?: (suggestions: any) => void;
}

export function AIAssistant({ cvData, onApplySuggestions }: AIAssistantProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [adaptation, setAdaptation] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [pdfFormat, setPdfFormat] = useState<CoverLetterFormat>('minimal');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const handleAdaptCV = async () => {
    if (!jobDescription.trim()) {
      toast.error('Por favor pega la descripción de la oferta');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('adapt-cv', {
        body: { cvData, jobDescription, language }
      });

      if (error) throw error;

      if (data?.adaptation) {
        setAdaptation(data.adaptation);
        setEditedSummary(data.adaptation.suggestions?.summary || '');
        setIsEditingSummary(false);
        toast.success('Análisis completado');
      }
    } catch (error: any) {
      console.error('Error adapting CV:', error);
      toast.error('Error al analizar la oferta');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error(language === 'es' ? 'Por favor pega la descripción de la oferta' : 'Please paste the job description');
      return;
    }

    setIsGeneratingLetter(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
        body: { cvData, jobDescription, language }
      });

      if (error) throw error;

      if (data?.coverLetter) {
        setCoverLetter(data.coverLetter);
        setIsEditingLetter(false);
        
        const wordCount = data.wordCount || data.coverLetter.split(/\s+/).length;
        if (wordCount > 450) {
          toast.success(`${language === 'es' ? 'Carta generada' : 'Cover letter generated'} (${wordCount} ${language === 'es' ? 'palabras' : 'words'} - ${language === 'es' ? 'considera acortarla' : 'consider shortening it'})`);
        } else {
          toast.success(`${language === 'es' ? 'Carta generada' : 'Cover letter generated'} (${wordCount} ${language === 'es' ? 'palabras' : 'words'}) ✓`);
        }
      }
    } catch (error: any) {
      console.error('Error generating cover letter:', error);
      toast.error(language === 'es' ? 'Error al generar la carta' : 'Error generating cover letter');
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success(language === 'es' ? 'Carta copiada al portapapeles' : 'Cover letter copied to clipboard');
  };

  const handlePreview = () => {
    const position = extractPosition(jobDescription);
    const options = {
      candidateName: cvData.personalInfo.fullName,
      position: position,
      format: pdfFormat,
      email: cvData.personalInfo.email,
      phone: cvData.personalInfo.phone,
      location: cvData.personalInfo.location,
      linkedin: cvData.personalInfo.linkedin,
    };

    const url = generateCoverLetterPreview(coverLetter, options);
    if (url) {
      setPreviewUrl(url);
      setShowPreview(true);
    } else {
      toast.error(language === 'es' ? 'Error al generar la vista previa' : 'Error generating preview');
    }
  };

  const downloadCoverLetterPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const position = extractPosition(jobDescription);
      const options = {
        candidateName: cvData.personalInfo.fullName,
        position: position,
        format: pdfFormat,
        email: cvData.personalInfo.email,
        phone: cvData.personalInfo.phone,
        location: cvData.personalInfo.location,
        linkedin: cvData.personalInfo.linkedin,
      };

      const success = generateCoverLetterPDF(coverLetter, options);

      if (success) {
        toast.success(language === 'es' ? 'PDF descargado correctamente' : 'PDF downloaded successfully');
      } else {
        toast.error(language === 'es' ? 'Error al generar el PDF' : 'Error generating PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error(language === 'es' ? 'Error al descargar el PDF' : 'Error downloading PDF');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const extractPosition = (description: string): string => {
    const patterns = [
      /puesto[:\s]+([^\n.]+)/i,
      /posición[:\s]+([^\n.]+)/i,
      /cargo[:\s]+([^\n.]+)/i,
      /vacante[:\s]+([^\n.]+)/i,
      /position[:\s]+([^\n.]+)/i,
      /role[:\s]+([^\n.]+)/i,
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1].trim().substring(0, 50);
      }
    }

    return language === 'es' ? 'Oferta' : 'Job Offer';
  };

  const applyAdaptation = () => {
    if (adaptation && onApplySuggestions) {
      const updatedSuggestions = {
        ...adaptation.suggestions,
        summary: editedSummary
      };
      onApplySuggestions(updatedSuggestions);
      toast.success(language === 'es' ? 'Sugerencias aplicadas' : 'Suggestions applied');
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Idioma Global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌍 {language === 'es' ? 'Idioma' : 'Language'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={(value) => setLanguage(value as 'es' | 'en')}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">
                <div className="flex items-center gap-2">
                  <span>🇪🇸</span>
                  <span>Español</span>
                </div>
              </SelectItem>
              <SelectItem value="en">
                <div className="flex items-center gap-2">
                  <span>🇬🇧</span>
                  <span>English</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Asistente de Adaptación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {language === 'es' ? 'Asistente de Adaptación de CV con IA' : 'AI CV Adaptation Assistant'}
          </CardTitle>
          <CardDescription>
            {language === 'es' 
              ? 'Pega una oferta de trabajo para analizar tu CV, obtener una puntuación de compatibilidad y recibir sugerencias de la IA para adaptar tu perfil al puesto.'
              : 'Paste a job offer to analyze your CV, get a compatibility score and receive AI suggestions to adapt your profile to the position.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'es' ? 'Descripción de la Oferta' : 'Job Description'}
            </label>
            <Textarea
              placeholder={language === 'es' ? 'Pega aquí la descripción completa de la oferta de trabajo...' : 'Paste the complete job description here...'}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <Button
            onClick={handleAdaptCV}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === 'es' ? 'Analizando...' : 'Analyzing...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Analizar con IA' : 'Analyze with AI'}
              </>
            )}
          </Button>

          {adaptation && (
            <div className="space-y-4 mt-6 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">
                  {language === 'es' ? 'Puntuación de Compatibilidad' : 'Compatibility Score'}
                </h4>
                <Badge variant={adaptation.compatibilityScore >= 70 ? "default" : "secondary"} className="text-lg px-4 py-1">
                  {adaptation.compatibilityScore}/100
                </Badge>
              </div>

              <Separator />

              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  {language === 'es' ? 'Habilidades Coincidentes' : 'Matched Skills'}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {adaptation.matchedSkills?.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-green-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {adaptation.missingSkills?.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2">
                    {language === 'es' ? 'Habilidades Faltantes' : 'Missing Skills'}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {adaptation.missingSkills.map((skill: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-orange-50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h5 className="font-semibold mb-2">
                  {language === 'es' ? 'Recomendaciones Generales' : 'General Recommendations'}
                </h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {adaptation.overallRecommendations?.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {adaptation.suggestions?.summary && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold">
                      {language === 'es' ? 'Resumen Sugerido' : 'Suggested Summary'}
                    </h5>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingSummary(!isEditingSummary)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      {isEditingSummary ? (language === 'es' ? 'Cancelar' : 'Cancel') : (language === 'es' ? 'Editar' : 'Edit')}
                    </Button>
                  </div>
                  {isEditingSummary ? (
                    <Textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      className="min-h-[100px] text-sm"
                    />
                  ) : (
                    <p className="text-sm bg-background p-3 rounded border">
                      {editedSummary}
                    </p>
                  )}
                </div>
              )}

              {onApplySuggestions && (
                <Button onClick={applyAdaptation} className="w-full" variant="secondary">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Aplicar Sugerencias al CV' : 'Apply Suggestions to CV'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generador de Carta de Presentación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {language === 'es' ? 'Generador de Carta de Presentación' : 'Cover Letter Generator'}
          </CardTitle>
          <CardDescription>
            {language === 'es'
              ? 'Pega la descripción de una oferta de trabajo para generar una carta de presentación profesional y personalizada.'
              : 'Paste a job description to generate a professional and personalized cover letter.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'es' ? 'Descripción de la Oferta' : 'Job Description'}
            </label>
            <Textarea
              placeholder={language === 'es' ? 'Pega aquí la descripción completa de la oferta...' : 'Paste the complete job description here...'}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button
            onClick={handleGenerateCoverLetter}
            disabled={isGeneratingLetter || !jobDescription.trim()}
            className="w-full"
          >
            {isGeneratingLetter ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === 'es' ? 'Generando...' : 'Generating...'}
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Generar Carta con IA' : 'Generate Letter with AI'}
              </>
            )}
          </Button>

          {coverLetter && (
            <div className="space-y-3 mt-6 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  {language === 'es' ? 'Carta de Presentación' : 'Cover Letter'}
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingLetter(!isEditingLetter)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  {isEditingLetter ? (language === 'es' ? 'Ver' : 'View') : (language === 'es' ? 'Editar' : 'Edit')}
                </Button>
              </div>

              {coverLetter.split(/\s+/).length > 450 && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800 flex items-start gap-2">
                  <span>⚠️</span>
                  <div>
                    <div className="font-semibold">
                      {language === 'es' ? 'Carta un poco larga' : 'Letter a bit long'}
                    </div>
                    <div>
                      {language === 'es'
                        ? `Actualmente: ${coverLetter.split(/\s+/).length} palabras. Ideal: 350-450 palabras para caber perfectamente en 1 página.`
                        : `Currently: ${coverLetter.split(/\s+/).length} words. Ideal: 350-450 words to fit perfectly on 1 page.`}
                    </div>
                  </div>
                </div>
              )}

              {isEditingLetter ? (
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="min-h-[300px] text-sm font-serif"
                />
              ) : (
                <div className="bg-background p-4 rounded border whitespace-pre-wrap text-sm">
                  {coverLetter}
                </div>
              )}

              <Separator />

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === 'es' ? 'Formato del PDF' : 'PDF Format'}
                </label>
                <Select value={pdfFormat} onValueChange={(value) => setPdfFormat(value as CoverLetterFormat)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {language === 'es' ? 'Minimalista' : 'Minimal'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {language === 'es' ? 'Solo fecha y contenido' : 'Date and content only'}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="formal">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {language === 'es' ? 'Formal' : 'Formal'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {language === 'es' ? 'Con datos de contacto completos' : 'With full contact details'}
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={copyCoverLetter} 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {language === 'es' ? 'Copiar' : 'Copy'}
                </Button>
                <Button 
                  onClick={handlePreview}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {language === 'es' ? 'Vista Previa' : 'Preview'}
                </Button>
                <Button 
                  onClick={downloadCoverLetterPDF}
                  disabled={isDownloadingPDF}
                  size="sm"
                  variant="default"
                  className="flex-1"
                >
                  {isDownloadingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      {language === 'es' ? 'Generando...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-1" />
                      {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Vista Previa */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {language === 'es' ? 'Vista Previa - Carta de Presentación' : 'Preview - Cover Letter'}
            </DialogTitle>
            <DialogDescription>
              {language === 'es' ? 'Formato:' : 'Format:'} {pdfFormat === 'minimal' ? (language === 'es' ? 'Minimalista' : 'Minimal') : (language === 'es' ? 'Formal' : 'Formal')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-full border rounded"
                title={language === 'es' ? 'Vista previa del PDF' : 'PDF preview'}
              />
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              {language === 'es' ? 'Cerrar' : 'Close'}
            </Button>
            <Button onClick={() => {
              setShowPreview(false);
              downloadCoverLetterPDF();
            }}>
              <Download className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}