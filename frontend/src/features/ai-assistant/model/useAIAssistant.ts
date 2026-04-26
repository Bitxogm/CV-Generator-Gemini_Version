import { useState } from 'react';
import { CVData } from '@/entities/cv/model';
import { CoverLetterFormat } from '@/shared/utils';

export interface AISuggestions {
  summary?: string;
  skills?: CVData['skills'];
  experience?: CVData['experience'];
}

export interface AdaptationData {
  compatibilityScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  overallRecommendations: string[];
  suggestions: AISuggestions;
}

export const useAIAssistant = () => {
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [pdfFormat, setPdfFormat] = useState<CoverLetterFormat>('minimal');
  const [adaptation, setAdaptation] = useState<AdaptationData | null>(null);
  const [editedSummary, setEditedSummary] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  return {
    jobUrl, setJobUrl,
    jobDescription, setJobDescription,
    coverLetter, setCoverLetter,
    pdfFormat, setPdfFormat,
    adaptation, setAdaptation,
    editedSummary, setEditedSummary,
    showPreview, setShowPreview,
    previewUrl, setPreviewUrl,
    isEditingLetter, setIsEditingLetter,
    isEditingSummary, setIsEditingSummary,
  };
};
