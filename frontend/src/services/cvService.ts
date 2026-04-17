import axios from '@/lib/axios';
import { ApiResponse, getResponseData } from '@/lib/axios';
import { CVData } from '@/types/cv';

export interface JobOfferData {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location?: string;
  salary?: string;
}

export interface Suggestion {
  id: string;
  type: 'improve' | 'add' | 'remove';
  section: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

// Tipos para el backend
export interface SavedCVBackend {
  id: string;
  userId: string;
  title: string;
  cvData: CVData;
  pdfUrl?: string;
  jobOffer?: JobOfferData;
  coverLetter?: string;
  suggestions?: Suggestion[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCVInput {
  title: string;
  cvData: CVData;
}

export interface UpdateCVInput {
  title?: string;
  cvData?: CVData;
}

/**
 * Servicio de CVs
 * Maneja todas las peticiones relacionadas con CVs
 */
class CVService {
  /**
   * Crear nuevo CV
   */
  async create(data: CreateCVInput): Promise<SavedCVBackend> {
    const response = await axios.post<ApiResponse<SavedCVBackend>>('/cvs', data);
    return getResponseData(response);
  }

  /**
   * Obtener todos mis CVs
   */
  async getMyCVs(): Promise<SavedCVBackend[]> {
    const response = await axios.get<ApiResponse<SavedCVBackend[]>>('/cvs');
    return getResponseData(response);
  }

  /**
   * Obtener CV por ID
   */
  async getById(id: string): Promise<SavedCVBackend> {
    const response = await axios.get<ApiResponse<SavedCVBackend>>(`/cvs/${id}`);
    return getResponseData(response);
  }

  /**
   * Actualizar CV
   */
  async update(id: string, data: UpdateCVInput): Promise<SavedCVBackend> {
    const response = await axios.put<ApiResponse<SavedCVBackend>>(`/cvs/${id}`, data);
    return getResponseData(response);
  }

  /**
   * Eliminar CV
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`/cvs/${id}`);
  }

  /**
   * Adaptar CV a oferta de trabajo (IA)
   */
  async adaptToJobOffer(id: string, jobOffer: string): Promise<SavedCVBackend> {
    const response = await axios.post<ApiResponse<SavedCVBackend>>(
      `/cvs/${id}/adapt`,
      { jobOffer }
    );
    return getResponseData(response);
  }

  /**
   * Generar sugerencias (IA)
   */
  async generateSuggestions(id: string): Promise<Suggestion[]> {
    const response = await axios.post<ApiResponse<Suggestion[]>>(`/cvs/${id}/suggestions`);
    return getResponseData(response);
  }

  /**
   * Generar carta de presentación (IA)
   */
  async generateCoverLetter(id: string, jobOffer: string): Promise<string> {
    const response = await axios.post<ApiResponse<{ coverLetter: string }>>(
      `/cvs/${id}/cover-letter`,
      { jobOffer }
    );
    const data = getResponseData(response);
    return data.coverLetter;
  }
}

export const cvService = new CVService();
export default cvService;