import { useState } from 'react';
import { toast } from 'sonner';
import { ATSAnalysis } from '@/entities/cv/model';
import { cvService } from '@/entities/cv/api';

type TFn = (key: string, opts?: Record<string, unknown>) => string;

const calculateATSScore = (suggestions: string[]): number => {
  const penalty = Math.min(suggestions.length * 5, 40);
  return Math.max(100 - penalty, 50);
};

const extractKeywords = (suggestions: string[]): { matched: string[]; missing: string[] } => {
  const missing: string[] = [];
  suggestions.forEach(suggestion => {
    const matches = suggestion.match(/(?:añade|incluye|menciona|agrega)\s+["']?([^"',.]+)["']?/gi);
    if (matches) {
      matches.forEach(match => {
        const keyword = match
          .replace(/(?:añade|incluye|menciona|agrega)\s+["']?/gi, '')
          .replace(/["']?/g, '');
        missing.push(keyword.trim());
      });
    }
  });
  return { matched: [], missing: missing.slice(0, 10) };
};

export const useATSAnalysis = (t: TFn) => {
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCV = async (cvId: string | null): Promise<void> => {
    if (!cvId) {
      toast.error('Guarda el CV primero para poder analizarlo');
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('🤖 Analizando CV con backend...');
      const suggestions = await cvService.generateSuggestions(cvId);
      const suggestionTexts = suggestions.map(s => s.text);

      const analysis: ATSAnalysis = {
        score: calculateATSScore(suggestionTexts),
        keywords: extractKeywords(suggestionTexts),
        suggestions: suggestionTexts,
        strengths: suggestions.filter(s => s.priority === 'low').map(s => s.text),
        weaknesses: suggestions.filter(s => s.priority === 'high').map(s => s.text),
      };

      setAtsAnalysis(analysis);
      toast.success(t('notifications.atsCompleted'));
    } catch (error: unknown) {
      console.error('❌ Error en análisis ATS:', error);
      toast.error(t('notifications.atsError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    atsAnalysis,
    isAnalyzing,
    analyzeCV,
    clearAnalysis: () => setAtsAnalysis(null),
  };
};
