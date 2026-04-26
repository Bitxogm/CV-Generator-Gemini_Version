import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CVData } from '@/entities/cv/model';
import { cvService, SavedCVBackend } from '@/entities/cv/api';

type TFn = (key: string, opts?: Record<string, unknown>) => string;

export const useCVDashboard = (t: TFn) => {
  const [savedCVs, setSavedCVs] = useState<SavedCVBackend[]>([]);
  const [currentCVId, setCurrentCVId] = useState<string | null>(null);

  useEffect(() => {
    loadSavedCVs();
  }, []);

  const loadSavedCVs = async () => {
    try {
      const cvs = await cvService.getMyCVs();
      setSavedCVs(cvs);
    } catch (error) {
      console.error('Error cargando CVs:', error);
      toast.error('Error al cargar tus CVs');
    }
  };

  const createCV = async (title: string, cvData: CVData): Promise<string | null> => {
    try {
      const newCV = await cvService.create({ title, cvData });
      setCurrentCVId(newCV.id);
      toast.success(t('notifications.cvSaved'));
      await loadSavedCVs();
      return newCV.id;
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('notifications.errorSaving');
      toast.error(msg);
      return null;
    }
  };

  const updateCV = async (id: string, cvData: CVData): Promise<void> => {
    try {
      await cvService.update(id, { cvData });
      toast.success('CV actualizado correctamente');
      await loadSavedCVs();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('notifications.errorSaving');
      toast.error(msg);
    }
  };

  const deleteCV = async (id: string): Promise<void> => {
    try {
      await cvService.delete(id);
      await loadSavedCVs();
      toast.success('CV eliminado');
    } catch (error) {
      console.error('Error eliminando CV:', error);
      toast.error('Error al eliminar CV');
    }
  };

  return {
    savedCVs,
    currentCVId,
    setCurrentCVId,
    loadSavedCVs,
    createCV,
    updateCV,
    deleteCV,
  };
};
