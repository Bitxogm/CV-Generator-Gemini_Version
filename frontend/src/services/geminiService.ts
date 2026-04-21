// src/services/geminiService.ts
import api from '@/lib/axios';
import { CVData } from '@/types/cv';

export interface CompatibilityAnalysis {
  score: number;
  analysis: string;
  missing: string[];
}

export type AdaptedCVData = Partial<CVData>;

/**
 * Adapta un CV según una descripción de trabajo
 * Ahora usa el backend para mayor seguridad (API key no expuesta)
 */
export async function adaptCVWithGemini(
  cvData: CVData,
  jobDescription: string,
): Promise<AdaptedCVData> {
  try {
    console.log('🤖 Adaptando CV con backend...');
    
    // Primero necesitamos el ID del CV
    // Si no tenemos ID, creamos el CV temporalmente
    const cvResponse = await api.post('/cvs', {
      title: 'Temporal para adaptación',
      cvData,
    });
    
    const cvId = cvResponse.data.data.id;
    
    // Llamar al endpoint de adaptación
    const response = await api.post(`/cvs/${cvId}/adapt`, {
      jobOffer: {
        title: 'Puesto',
        company: 'Empresa',
        description: jobDescription,
        requirements: [],
      },
    });
    
    console.log('✅ CV adaptado por el backend');
    return response.data.data.cvData;
  } catch (error) {
    console.error('❌ Error al adaptar CV:', error);
    throw error;
  }
}

/**
 * Genera sugerencias de mejora para un CV
 */
export async function generateCVSuggestions(cvData: CVData): Promise<string[]> {
  try {
    console.log('🤖 Generando sugerencias con backend...');
    
    // Crear CV temporal
    const cvResponse = await api.post('/cvs', {
      title: 'Temporal para sugerencias',
      cvData,
    });
    
    const cvId = cvResponse.data.data.id;
    
    // Llamar al endpoint de sugerencias
    const response = await api.post(`/cvs/${cvId}/suggestions`);
    
    console.log('✅ Sugerencias generadas');
    
    // Backend devuelve array de objetos Suggestion, convertimos a strings
    return response.data.data.suggestions.map((s: any) => s.text);
  } catch (error) {
    console.error('❌ Error al generar sugerencias:', error);
    throw error;
  }
}

/**
 * Analiza compatibilidad entre CV y trabajo (0-100%)
 */
export async function analyzeCVCompatibility(
  cvData: CVData,
  jobDescription: string,
): Promise<CompatibilityAnalysis> {
  try {
    console.log('🤖 Analizando compatibilidad con backend...');
    
    // Por ahora usamos adaptación y extraemos score
    // TODO: Crear endpoint específico para análisis
    const adapted = await adaptCVWithGemini(cvData, jobDescription);
    
    return {
      score: 75, // Placeholder
      analysis: 'Análisis en desarrollo',
      missing: [],
    };
  } catch (error) {
    console.error('❌ Error al analizar compatibilidad:', error);
    throw error;
  }
}

/**
 * Genera carta de presentación personalizada
 */
export async function generateCoverLetter(
  cvData: CVData,
  jobDescription: string,
  companyName: string,
): Promise<string> {
  try {
    console.log('🤖 Generando carta con backend...');
    
    // Crear CV temporal
    const cvResponse = await api.post('/cvs', {
      title: 'Temporal para carta',
      cvData,
    });
    
    const cvId = cvResponse.data.data.id;
    
    // Llamar al endpoint de cover letter
    const response = await api.post(`/cvs/${cvId}/cover-letter`, {
      jobOffer: {
        title: 'Puesto',
        company: companyName,
        description: jobDescription,
        requirements: [],
      },
    });
    
    console.log('✅ Carta generada');
    return response.data.data.coverLetter;
  } catch (error) {
    console.error('❌ Error al generar carta:', error);
    throw error;
  }
}

export default {
  adaptCVWithGemini,
  generateCVSuggestions,
  analyzeCVCompatibility,
  generateCoverLetter,
};