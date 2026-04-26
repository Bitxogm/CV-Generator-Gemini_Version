import { useState } from 'react';
import { toast } from 'sonner';
import { CVData } from '@/entities/cv/model';
import { adaptCVWithGemini, analyzeCVCompatibility, CompatibilityAnalysis } from '@/shared/services';
import { AdaptationData, AISuggestions } from './useAIAssistant';

type TFn = (key: string, opts?: Record<string, unknown>) => string;

const extractMatchedSkills = (cv: CVData, jobDesc: string): string[] => {
  const lower = jobDesc.toLowerCase();
  return (cv.skills ?? []).filter(s => lower.includes(s.toLowerCase())).slice(0, 10);
};

const buildRecommendations = (result: CompatibilityAnalysis): string[] => {
  const recs: string[] = [];
  if (result.score < 50) recs.push('Considera añadir más habilidades relevantes al puesto');
  if (result.missing?.length > 0)
    recs.push(`Desarrolla conocimientos en: ${result.missing.slice(0, 3).join(', ')}`);
  if (result.score >= 70) recs.push('Tu perfil es muy compatible con este puesto');
  return recs;
};

export const useCVAdapter = (t: TFn) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const adaptCV = async (
    cvData: CVData,
    jobDescription: string,
  ): Promise<AdaptationData | null> => {
    if (!jobDescription.trim()) {
      toast.error(t('aiAssistant.pleaseJobDescription'));
      return null;
    }

    setIsAnalyzing(true);
    try {
      console.log('🤖 Analizando CV con Gemini 1.5 Flash...');

      const compatibilityResult = await analyzeCVCompatibility(cvData, jobDescription);
      const adaptedCV = await adaptCVWithGemini(cvData, jobDescription);

      const adaptation: AdaptationData = {
        compatibilityScore: compatibilityResult.score,
        matchedSkills: extractMatchedSkills(cvData, jobDescription),
        missingSkills: compatibilityResult.missing || [],
        overallRecommendations: [
          compatibilityResult.analysis,
          ...buildRecommendations(compatibilityResult),
        ],
        suggestions: {
          summary: adaptedCV.summary || '',
          skills: adaptedCV.skills || cvData.skills,
          experience: adaptedCV.experience || cvData.experience,
        } as AISuggestions,
      };

      console.log('✅ Análisis completado con Gemini');
      toast.success(t('aiAssistant.analysisCompleted'));
      return adaptation;
    } catch (error) {
      console.error('❌ Error al adaptar CV con Gemini:', error);
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('aiAssistant.errorAnalyzing');
      toast.error(msg);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { adaptCV, isAnalyzing };
};
