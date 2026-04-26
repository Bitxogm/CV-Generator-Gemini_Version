import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/shared/ui/select';
import { CVData } from '@/entities/cv/model';
import { useLanguage } from '@/app/providers';
import { useAIAssistant, AISuggestions } from '../model/useAIAssistant';
import { useJobExtraction } from '../model/useJobExtraction';
import { useCoverLetter } from '../model/useCoverLetter';
import { useCVAdapter } from '../model/useCVAdapter';
import { CVAdaptationCard } from './components/CVAdaptationCard';
import { CoverLetterCard } from './components/CoverLetterCard';
import { CoverLetterPreviewDialog } from './components/CoverLetterPreviewDialog';

interface AIAssistantProps {
  cvData: CVData;
  onApplySuggestions?: (suggestions: AISuggestions) => void;
}

export function AIAssistant({ cvData, onApplySuggestions }: AIAssistantProps) {
  const { t, language, setLanguage } = useLanguage();

  const state = useAIAssistant();
  const { extractFromUrl, isExtractingUrl } = useJobExtraction();
  const coverLetterHook = useCoverLetter(t);
  const { adaptCV, isAnalyzing } = useCVAdapter(t);

  const extractCompanyName = (desc: string): string | null => {
    const patterns = [
      /empresa[:\s]+([^\n.,]+)/i,
      /company[:\s]+([^\n.,]+)/i,
      /organización[:\s]+([^\n.,]+)/i,
      /organization[:\s]+([^\n.,]+)/i,
    ];
    for (const pattern of patterns) {
      const match = desc.match(pattern);
      if (match?.[1]) return match[1].trim();
    }
    const lines = desc.split('\n');
    for (const line of lines.slice(0, 5)) {
      const cap = line.match(/^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/);
      if (cap?.[1] && cap[1].split(' ').length <= 3) return cap[1];
    }
    return null;
  };

  const extractPosition = (desc: string): string => {
    const patterns = [
      /puesto[:\s]+([^\n.]+)/i,
      /posición[:\s]+([^\n.]+)/i,
      /cargo[:\s]+([^\n.]+)/i,
      /vacante[:\s]+([^\n.]+)/i,
      /position[:\s]+([^\n.]+)/i,
      /role[:\s]+([^\n.]+)/i,
    ];
    for (const pattern of patterns) {
      const match = desc.match(pattern);
      if (match?.[1]) return match[1].trim().substring(0, 50);
    }
    return t('aiAssistant.jobOffer');
  };

  const buildPdfOptions = () => ({
    candidateName: cvData.personalInfo.fullName,
    position: extractPosition(state.jobDescription),
    format: state.pdfFormat,
    email: cvData.personalInfo.email,
    phone: cvData.personalInfo.phone,
    location: cvData.personalInfo.location,
    linkedin: cvData.personalInfo.linkedin,
    language: language as 'es' | 'en',
  });

  const handleExtractFromUrl = async () => {
    const description = await extractFromUrl(state.jobUrl);
    if (description) state.setJobDescription(description);
  };

  const handleAdaptCV = async () => {
    const result = await adaptCV(cvData, state.jobDescription);
    if (result) {
      state.setAdaptation(result);
      state.setEditedSummary(result.suggestions?.summary || '');
      state.setIsEditingSummary(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    const companyName = extractCompanyName(state.jobDescription) || 'la empresa';
    const letter = await coverLetterHook.generateCoverLetterContent(cvData, state.jobDescription, companyName);
    if (letter) {
      state.setCoverLetter(letter);
      state.setIsEditingLetter(false);
    }
  };

  const applyAdaptation = () => {
    if (state.adaptation && onApplySuggestions) {
      onApplySuggestions({ ...state.adaptation.suggestions, summary: state.editedSummary });
    }
  };

  const handlePreview = () => {
    const url = coverLetterHook.previewLetter(state.coverLetter, buildPdfOptions());
    if (url) {
      state.setPreviewUrl(url);
      state.setShowPreview(true);
    }
  };

  const handleDownloadPDF = async () => {
    await coverLetterHook.downloadPDF(state.coverLetter, buildPdfOptions());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🌍 {t('common.language')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={(v) => setLanguage(v as 'es' | 'en')}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="es">
                <div className="flex items-center gap-2"><span>🇪🇸</span><span>{t('common.spanish')}</span></div>
              </SelectItem>
              <SelectItem value="en">
                <div className="flex items-center gap-2"><span>🇬🇧</span><span>{t('common.english')}</span></div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <CVAdaptationCard
        jobUrl={state.jobUrl}
        setJobUrl={state.setJobUrl}
        isExtractingUrl={isExtractingUrl}
        onExtractUrl={handleExtractFromUrl}
        jobDescription={state.jobDescription}
        setJobDescription={state.setJobDescription}
        isAnalyzing={isAnalyzing}
        onAdaptCV={handleAdaptCV}
        adaptation={state.adaptation}
        editedSummary={state.editedSummary}
        setEditedSummary={state.setEditedSummary}
        isEditingSummary={state.isEditingSummary}
        setIsEditingSummary={state.setIsEditingSummary}
        showApplyButton={!!onApplySuggestions}
        onApplySuggestions={applyAdaptation}
      />

      <CoverLetterCard
        jobDescription={state.jobDescription}
        setJobDescription={state.setJobDescription}
        isGeneratingLetter={coverLetterHook.isGeneratingLetter}
        onGenerateLetter={handleGenerateCoverLetter}
        coverLetter={state.coverLetter}
        setCoverLetter={state.setCoverLetter}
        isEditingLetter={state.isEditingLetter}
        setIsEditingLetter={state.setIsEditingLetter}
        pdfFormat={state.pdfFormat}
        setPdfFormat={state.setPdfFormat}
        onCopy={() => coverLetterHook.copyToClipboard(state.coverLetter)}
        onPreview={handlePreview}
        onDownloadPDF={handleDownloadPDF}
        isDownloadingPDF={coverLetterHook.isDownloadingPDF}
      />

      <CoverLetterPreviewDialog
        open={state.showPreview}
        onOpenChange={state.setShowPreview}
        previewUrl={state.previewUrl}
        pdfFormat={state.pdfFormat}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
}
