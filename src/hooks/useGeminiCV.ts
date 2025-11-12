// src/hooks/useGeminiCV.ts
import { useState } from 'react';
import { 
  adaptCVWithGemini, 
  generateCVSuggestions,
  analyzeCVCompatibility,
  generateCoverLetter 
} from '../services/geminiService';

interface UseGeminiCVReturn {
  // Estados
  loading: boolean;
  error: string | null;
  adaptedCV: any | null;
  suggestions: string[] | null;
  compatibility: { score: number; analysis: string; missing: string[] } | null;
  coverLetter: string | null;
  
  // Funciones
  adaptCV: (cvData: any, jobDescription: string) => Promise<void>;
  getSuggestions: (cvData: any) => Promise<void>;
  analyzeCompatibility: (cvData: any, jobDescription: string) => Promise<void>;
  createCoverLetter: (cvData: any, jobDescription: string, companyName: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function useGeminiCV(): UseGeminiCVReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adaptedCV, setAdaptedCV] = useState<any | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [compatibility, setCompatibility] = useState<any | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);

  // Adaptar CV
  const adaptCV = async (cvData: any, jobDescription: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📝 Adaptando CV con Gemini...');
      const result = await adaptCVWithGemini(cvData, jobDescription);
      setAdaptedCV(result);
      console.log('✅ CV adaptado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al adaptar CV';
      setError(errorMessage);
      console.error('❌ Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Obtener sugerencias
  const getSuggestions = async (cvData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('💡 Generando sugerencias...');
      const result = await generateCVSuggestions(cvData);
      setSuggestions(result);
      console.log('✅ Sugerencias generadas');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar sugerencias';
      setError(errorMessage);
      console.error('❌ Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Analizar compatibilidad
  const analyzeCompatibility = async (cvData: any, jobDescription: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Analizando compatibilidad...');
      const result = await analyzeCVCompatibility(cvData, jobDescription);
      setCompatibility(result);
      console.log(`✅ Compatibilidad: ${result.score}%`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al analizar compatibilidad';
      setError(errorMessage);
      console.error('❌ Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Crear carta de presentación
  const createCoverLetter = async (cvData: any, jobDescription: string, companyName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('✉️ Generando carta de presentación...');
      const result = await generateCoverLetter(cvData, jobDescription, companyName);
      setCoverLetter(result);
      console.log('✅ Carta generada');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar carta';
      setError(errorMessage);
      console.error('❌ Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar error
  const clearError = () => setError(null);

  // Reset completo
  const reset = () => {
    setLoading(false);
    setError(null);
    setAdaptedCV(null);
    setSuggestions(null);
    setCompatibility(null);
    setCoverLetter(null);
  };

  return {
    loading,
    error,
    adaptedCV,
    suggestions,
    compatibility,
    coverLetter,
    adaptCV,
    getSuggestions,
    analyzeCompatibility,
    createCoverLetter,
    clearError,
    reset,
  };
}