import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { toast } from 'sonner';
import { Sparkles, Loader2, FileText, CheckCircle2, Download, Copy, Eye, Edit2, Link } from 'lucide-react';
import { CVData } from '@/entities/cv/model';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import { generateCoverLetterPDF, generateCoverLetterPreview, CoverLetterFormat } from '@/shared/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { useLanguage } from '@/app/providers';
import { adaptCVWithGemini, generateCoverLetter, analyzeCVCompatibility } from '@/shared/services';
import api from '@/shared/api';

interface AISuggestions {
  summary?: string;
  skills?: CVData['skills'];
  experience?: CVData['experience'];
}

interface CompatibilityResult {
  score: number;
  analysis: string;
  missing: string[];
}

interface AdaptationData {
  compatibilityScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  overallRecommendations: string[];
  suggestions: AISuggestions;
}

interface AIAssistantProps {
  cvData: CVData;
  onApplySuggestions?: (suggestions: AISuggestions) => void;
}

export function AIAssistant({ cvData, onApplySuggestions }: AIAssistantProps) {
  const { t, language, setLanguage } = useLanguage();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [adaptation, setAdaptation] = useState<AdaptationData | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [pdfFormat, setPdfFormat] = useState<CoverLetterFormat>('minimal');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);

  const extractMatchedSkills = (cv: CVData, jobDesc: string): string[] => {
    const jobDescLower = jobDesc.toLowerCase();
    const matched: string[] = [];

    cv.skills?.forEach(skill => {
      if (jobDescLower.includes(skill.toLowerCase())) {
        matched.push(skill);
      }
    });

    return matched.slice(0, 10);
  };

  const generateRecommendations = (compatibility: CompatibilityResult): string[] => {
    const recommendations: string[] = [];

    if (compatibility.score < 50) {
      recommendations.push('Considera añadir más habilidades relevantes al puesto');
    }
    if (compatibility.missing?.length > 0) {
      recommendations.push(`Desarrolla conocimientos en: ${compatibility.missing.slice(0, 3).join(', ')}`);
    }
    if (compatibility.score >= 70) {
      recommendations.push('Tu perfil es muy compatible con este puesto');
    }

    return recommendations;
  };

  const extractCompanyName = (description: string): string | null => {
    const patterns = [
      /empresa[:\s]+([^\n.,]+)/i,
      /company[:\s]+([^\n.,]+)/i,
      /organización[:\s]+([^\n.,]+)/i,
      /organization[:\s]+([^\n.,]+)/i,
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    const lines = description.split('\n');
    for (const line of lines.slice(0, 5)) {
      const capitalized = line.match(/^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/);
      if (capitalized && capitalized[1] && capitalized[1].split(' ').length <= 3) {
        return capitalized[1];
      }
    }

    return null;
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

    return t('aiAssistant.jobOffer');
  };

  const handleAdaptCV = async () => {
    if (!jobDescription.trim()) {
      toast.error(t('aiAssistant.pleaseJobDescription'));
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('🤖 Analizando CV con Gemini 1.5 Flash...');

      const compatibilityResult = await analyzeCVCompatibility(cvData, jobDescription);
      const adaptedCV = await adaptCVWithGemini(cvData, jobDescription);

      const adaptationData: AdaptationData = {
        compatibilityScore: compatibilityResult.score,
        matchedSkills: extractMatchedSkills(cvData, jobDescription),
        missingSkills: compatibilityResult.missing || [],
        overallRecommendations: [
          compatibilityResult.analysis,
          ...generateRecommendations(compatibilityResult)
        ],
        suggestions: {
          summary: adaptedCV.summary || '',
          skills: adaptedCV.skills || cvData.skills,
          experience: adaptedCV.experience || cvData.experience,
        }
      };

      setAdaptation(adaptationData);
      setEditedSummary(adaptationData.suggestions?.summary || '');
      setIsEditingSummary(false);

      console.log('✅ Análisis completado con Gemini');
      toast.success(t('aiAssistant.analysisCompleted'));

    } catch (error) {
      console.error('❌ Error al adaptar CV con Gemini:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || t('aiAssistant.errorAnalyzing');
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExtractFromUrl = async () => {
    if (!jobUrl.trim()) {
      toast.error('Por favor ingresa una URL');
      return;
    }

    setIsExtractingUrl(true);
    try {
      console.log('🔗 Extrayendo información de URL:', jobUrl);

      const response = await api.post('/jobs/extract-from-url', { url: jobUrl });
      const data = response.data;

      if (data.success) {
        const formattedDescription = `
Título: ${data.data.title}
Empresa: ${data.data.company}

Descripción:
${data.data.description}

Requisitos:
${data.data.requirements.map((req: string) => `- ${req}`).join('\n')}
        `.trim();

        setJobDescription(formattedDescription);
        toast.success('✅ Información extraída correctamente');
      }
    } catch (error) {
      console.error('❌ Error extrayendo URL:', error);
      toast.error(error instanceof Error ? error.message : 'Error al extraer información de la URL');
    } finally {
      setIsExtractingUrl(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error(t('aiAssistant.pleaseJobDescription'));
      return;
    }

    setIsGeneratingLetter(true);
    try {
      console.log('✉️ Generando carta de presentación con Gemini 2.5 Flash...');

      const companyName = extractCompanyName(jobDescription) || 'la empresa';

      const generatedLetter = await generateCoverLetter(
        cvData,
        jobDescription,
        companyName
      );

      setCoverLetter(generatedLetter);
      setIsEditingLetter(false);

      const wordCount = generatedLetter.split(/\s+/).length;

      console.log(`✅ Carta generada (${wordCount} palabras)`);

      if (wordCount > 450) {
        toast.success(`${t('aiAssistant.coverLetterGeneratedWithCount', { count: wordCount })} - ${t('aiAssistant.considerShortening')}`);
      } else {
        toast.success(`${t('aiAssistant.coverLetterGeneratedWithCount', { count: wordCount })} ✓`);
      }

    } catch (error) {
      console.error('❌ Error al generar carta con Gemini:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || t('aiAssistant.coverLetterError');
      toast.error(errorMessage);
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const buildPdfOptions = () => ({
    candidateName: cvData.personalInfo.fullName,
    position: extractPosition(jobDescription),
    format: pdfFormat,
    email: cvData.personalInfo.email,
    phone: cvData.personalInfo.phone,
    location: cvData.personalInfo.location,
    linkedin: cvData.personalInfo.linkedin,
    language,
  });

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success(t('aiAssistant.copiedToClipboard'));
  };

  const handlePreview = () => {
    const url = generateCoverLetterPreview(coverLetter, buildPdfOptions());
    if (url) {
      setPreviewUrl(url);
      setShowPreview(true);
    } else {
      toast.error(t('aiAssistant.errorPreview'));
    }
  };

  const downloadCoverLetterPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const success = generateCoverLetterPDF(coverLetter, buildPdfOptions());

      if (success) {
        toast.success(t('aiAssistant.pdfDownloaded'));
      } else {
        toast.error(t('aiAssistant.errorPdf'));
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error(t('aiAssistant.errorDownloadPdf'));
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const applyAdaptation = () => {
    if (adaptation && onApplySuggestions) {
      const updatedSuggestions = {
        ...adaptation.suggestions,
        summary: editedSummary
      };
      onApplySuggestions(updatedSuggestions);
      toast.success(t('aiAssistant.suggestionsApplied'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Idioma Global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌍 {t('common.language')}
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
                  <span>{t('common.spanish')}</span>
                </div>
              </SelectItem>
              <SelectItem value="en">
                <div className="flex items-center gap-2">
                  <span>🇬🇧</span>
                  <span>{t('common.english')}</span>
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
            {t('aiAssistant.cvAdaptationTitle')}
          </CardTitle>
          <CardDescription>
            {t('aiAssistant.cvAdaptationDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 p-4 border rounded-lg bg-muted/10">
            <label className="text-sm font-medium flex items-center gap-2">
              <Link className="w-4 h-4" />
              URL de la oferta (opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://infojobs.net/oferta/12345 o https://linkedin.com/jobs/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button
                onClick={handleExtractFromUrl}
                disabled={isExtractingUrl || !jobUrl.trim()}
                variant="secondary"
              >
                {isExtractingUrl ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extrayendo...
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-2" />
                    Extraer
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Pega la URL de la oferta y la IA extraerá automáticamente el título, empresa, descripción y requisitos
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('aiAssistant.jobDescription')}
            </label>
            <Textarea
              placeholder={t('aiAssistant.jobDescriptionFullPlaceholder')}
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
                {t('aiAssistant.analyzing')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('aiAssistant.analyzeWithAI')}
              </>
            )}
          </Button>

          {adaptation && (
            <div className="space-y-4 mt-6 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">
                  {t('aiAssistant.compatibilityScore')}
                </h4>
                <Badge variant={adaptation.compatibilityScore >= 70 ? "default" : "secondary"} className="text-lg px-4 py-1">
                  {adaptation.compatibilityScore}/100
                </Badge>
              </div>

              <Separator />

              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  {t('aiAssistant.matchedSkills')}
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
                    {t('aiAssistant.missingSkills')}
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
                  {t('aiAssistant.generalRecommendations')}
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
                      {t('aiAssistant.suggestedSummary')}
                    </h5>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingSummary(!isEditingSummary)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      {isEditingSummary ? t('common.cancel') : t('common.edit')}
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
                  {t('aiAssistant.applySuggestions')}
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
            {t('aiAssistant.coverLetterGenerator')}
          </CardTitle>
          <CardDescription>
            {t('aiAssistant.coverLetterDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('aiAssistant.jobDescription')}
            </label>
            <Textarea
              placeholder={t('aiAssistant.jobDescriptionCompletePlaceholder')}
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
                {t('aiAssistant.generating')}
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                {t('aiAssistant.generateWithAI')}
              </>
            )}
          </Button>

          {coverLetter && (
            <div className="space-y-3 mt-6 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  {t('aiAssistant.coverLetter')}
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingLetter(!isEditingLetter)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  {isEditingLetter ? t('common.view') : t('common.edit')}
                </Button>
              </div>

              {coverLetter.split(/\s+/).length > 450 && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800 flex items-start gap-2">
                  <span>⚠️</span>
                  <div>
                    <div className="font-semibold">
                      {t('aiAssistant.letterTooLong')}
                    </div>
                    <div>
                      {t('aiAssistant.letterLengthWarning', { count: coverLetter.split(/\s+/).length })}
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
                  {t('aiAssistant.pdfFormat')}
                </label>
                <Select value={pdfFormat} onValueChange={(value) => setPdfFormat(value as CoverLetterFormat)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {t('aiAssistant.minimal')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t('aiAssistant.minimalDescription')}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="formal">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {t('aiAssistant.formal')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t('aiAssistant.formalDescription')}
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
                  {t('common.copy')}
                </Button>
                <Button
                  onClick={handlePreview}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {t('common.preview')}
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
                      {t('aiAssistant.generating')}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-1" />
                      {t('common.download')} PDF
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
              {t('aiAssistant.previewCoverLetter')}
            </DialogTitle>
            <DialogDescription>
              {t('aiAssistant.format')} {pdfFormat === 'minimal' ? t('aiAssistant.minimal') : t('aiAssistant.formal')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-full border rounded"
                title={t('aiAssistant.pdfPreview')}
              />
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              {t('common.close')}
            </Button>
            <Button onClick={() => {
              setShowPreview(false);
              downloadCoverLetterPDF();
            }}>
              <Download className="w-4 h-4 mr-2" />
              {t('common.download')} PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
