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
import { useLanguage } from '@/contexts/LanguageContext';

interface AIAssistantProps {
  cvData: CVData;
  onApplySuggestions?: (suggestions: any) => void;
}

export function AIAssistant({ cvData, onApplySuggestions }: AIAssistantProps) {
  const { t, language, setLanguage } = useLanguage();
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

  const handleAdaptCV = async () => {
    if (!jobDescription.trim()) {
      toast.error(t('aiAssistant.pleaseJobDescription'));
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
        toast.success(t('aiAssistant.analysisCompleted'));
      }
    } catch (error: any) {
      console.error('Error adapting CV:', error);
      toast.error(t('aiAssistant.errorAnalyzing'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error(t('aiAssistant.pleaseJobDescription'));
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
          toast.success(`${t('aiAssistant.coverLetterGeneratedWithCount', { count: wordCount })} - ${t('aiAssistant.considerShortening')}`);
        } else {
          toast.success(`${t('aiAssistant.coverLetterGeneratedWithCount', { count: wordCount })} ✓`);
        }
      }
    } catch (error: any) {
      console.error('Error generating cover letter:', error);
      toast.error(t('aiAssistant.coverLetterError'));
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success(t('aiAssistant.copiedToClipboard'));
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
      language: language,
    };

    const url = generateCoverLetterPreview(coverLetter, options);
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
      const position = extractPosition(jobDescription);
      const options = {
        candidateName: cvData.personalInfo.fullName,
        position: position,
        format: pdfFormat,
        email: cvData.personalInfo.email,
        phone: cvData.personalInfo.phone,
        location: cvData.personalInfo.location,
        linkedin: cvData.personalInfo.linkedin,
        language: language,
      };

      const success = generateCoverLetterPDF(coverLetter, options);

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