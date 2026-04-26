import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/shared/api';

export const useJobExtraction = () => {
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);

  const extractFromUrl = async (url: string): Promise<string | null> => {
    if (!url.trim()) {
      toast.error('Por favor ingresa una URL');
      return null;
    }

    setIsExtractingUrl(true);
    try {
      console.log('🔗 Extrayendo información de URL:', url);
      const response = await api.post('/jobs/extract-from-url', { url });
      const data = response.data;

      if (data.success) {
        const formatted = [
          `Título: ${data.data.title}`,
          `Empresa: ${data.data.company}`,
          '',
          'Descripción:',
          data.data.description,
          '',
          'Requisitos:',
          ...data.data.requirements.map((req: string) => `- ${req}`),
        ].join('\n');

        toast.success('✅ Información extraída correctamente');
        return formatted;
      }
      return null;
    } catch (error) {
      console.error('❌ Error extrayendo URL:', error);
      toast.error(error instanceof Error ? error.message : 'Error al extraer información de la URL');
      return null;
    } finally {
      setIsExtractingUrl(false);
    }
  };

  return { extractFromUrl, isExtractingUrl };
};
