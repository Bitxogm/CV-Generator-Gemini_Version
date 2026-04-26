import { useState } from 'react';
import { toast } from 'sonner';
import { CVData } from '@/entities/cv/model';
import { generateCoverLetter as generateCoverLetterService } from '@/shared/services';
import { generateCoverLetterPDF, generateCoverLetterPreview, CoverLetterFormat } from '@/shared/utils';

type TFn = (key: string, opts?: Record<string, unknown>) => string;

export interface PdfOptions {
  candidateName?: string;
  position?: string;
  format?: CoverLetterFormat;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  language?: 'es' | 'en';
}

export const useCoverLetter = (t: TFn) => {
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const generateCoverLetterContent = async (
    cvData: CVData,
    jobDescription: string,
    companyName: string,
  ): Promise<string | null> => {
    if (!jobDescription.trim()) {
      toast.error(t('aiAssistant.pleaseJobDescription'));
      return null;
    }

    setIsGeneratingLetter(true);
    try {
      console.log('✉️ Generando carta de presentación con Gemini 2.5 Flash...');
      const letter = await generateCoverLetterService(cvData, jobDescription, companyName);
      const wordCount = letter.split(/\s+/).length;

      const base = t('aiAssistant.coverLetterGeneratedWithCount', { count: wordCount });
      if (wordCount > 450) {
        toast.success(`${base} - ${t('aiAssistant.considerShortening')}`);
      } else {
        toast.success(`${base} ✓`);
      }

      console.log(`✅ Carta generada (${wordCount} palabras)`);
      return letter;
    } catch (error) {
      console.error('❌ Error al generar carta con Gemini:', error);
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('aiAssistant.coverLetterError');
      toast.error(msg);
      return null;
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const downloadPDF = async (content: string, options: PdfOptions): Promise<void> => {
    setIsDownloadingPDF(true);
    try {
      const success = generateCoverLetterPDF(content, options);
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

  const copyToClipboard = (content: string): void => {
    navigator.clipboard.writeText(content);
    toast.success(t('aiAssistant.copiedToClipboard'));
  };

  const previewLetter = (content: string, options: PdfOptions): string | null => {
    const url = generateCoverLetterPreview(content, options);
    if (!url) {
      toast.error(t('aiAssistant.errorPreview'));
      return null;
    }
    return url;
  };

  return {
    generateCoverLetterContent,
    isGeneratingLetter,
    downloadPDF,
    isDownloadingPDF,
    copyToClipboard,
    previewLetter,
  };
};
