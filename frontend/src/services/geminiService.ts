// src/services/geminiService.ts
import api from '@/lib/axios';
import { CVData } from '@/types/cv';

export interface CompatibilityAnalysis {
  score: number;
  analysis: string;
  missing: string[];
}

export type AdaptedCVData = Partial<CVData>;

export async function adaptCVWithGemini(
  cvData: CVData,
  jobDescription: string,
): Promise<AdaptedCVData> {
  let tempCvId: string | null = null;

  try {
    console.log('🤖 Adaptando CV con backend...');

    const cvResponse = await api.post('/cvs', {
      title: 'Temporal para adaptación',
      cvData,
    });

    tempCvId = cvResponse.data.data.id;

    const response = await api.post(`/cvs/${tempCvId}/adapt`, {
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
  } finally {
    if (tempCvId) {
      try {
        await api.delete(`/cvs/${tempCvId}`);
      } catch (deleteError) {
        console.error('Error eliminando CV temporal:', deleteError);
      }
    }
  }
}

export async function generateCVSuggestions(cvData: CVData): Promise<string[]> {
  let tempCvId: string | null = null;

  try {
    console.log('🤖 Generando sugerencias con backend...');

    const cvResponse = await api.post('/cvs', {
      title: 'Temporal para sugerencias',
      cvData,
    });

    tempCvId = cvResponse.data.data.id;

    const response = await api.post(`/cvs/${tempCvId}/suggestions`);

    console.log('✅ Sugerencias generadas');
    return response.data.data.suggestions.map((s: any) => s.text);
  } catch (error) {
    console.error('❌ Error al generar sugerencias:', error);
    throw error;
  } finally {
    if (tempCvId) {
      try {
        await api.delete(`/cvs/${tempCvId}`);
      } catch (deleteError) {
        console.error('Error eliminando CV temporal:', deleteError);
      }
    }
  }
}

export async function analyzeCVCompatibility(
  cvData: CVData,
  jobDescription: string,
): Promise<CompatibilityAnalysis> {
  try {
    console.log('🤖 Analizando compatibilidad con backend...');

    await adaptCVWithGemini(cvData, jobDescription);

    return {
      score: 75,
      analysis: 'Análisis en desarrollo',
      missing: [],
    };
  } catch (error) {
    console.error('❌ Error al analizar compatibilidad:', error);
    throw error;
  }
}

export async function generateCoverLetter(
  cvData: CVData,
  jobDescription: string,
  companyName: string,
): Promise<string> {
  let tempCvId: string | null = null;

  try {
    console.log('🤖 Generando carta con backend...');

    const cvResponse = await api.post('/cvs', {
      title: 'Temporal para carta',
      cvData,
    });

    tempCvId = cvResponse.data.data.id;

    const response = await api.post(`/cvs/${tempCvId}/cover-letter`, {
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
  } finally {
    if (tempCvId) {
      try {
        await api.delete(`/cvs/${tempCvId}`);
      } catch (deleteError) {
        console.error('Error eliminando CV temporal:', deleteError);
      }
    }
  }
}

export default {
  adaptCVWithGemini,
  generateCVSuggestions,
  analyzeCVCompatibility,
  generateCoverLetter,
};
