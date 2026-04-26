import axios from '@/shared/api';
import { ApiResponse, getResponseData } from '@/shared/api';
import { CVData } from '@/entities/cv/model';

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

class CVService {
  async create(data: CreateCVInput): Promise<SavedCVBackend> {
    const response = await axios.post<ApiResponse<SavedCVBackend>>('/cvs', data);
    return getResponseData(response);
  }

  async getMyCVs(): Promise<SavedCVBackend[]> {
    const response = await axios.get<ApiResponse<SavedCVBackend[]>>('/cvs');
    return getResponseData(response);
  }

  async getById(id: string): Promise<SavedCVBackend> {
    const response = await axios.get<ApiResponse<SavedCVBackend>>(`/cvs/${id}`);
    return getResponseData(response);
  }

  async update(id: string, data: UpdateCVInput): Promise<SavedCVBackend> {
    const response = await axios.put<ApiResponse<SavedCVBackend>>(`/cvs/${id}`, data);
    return getResponseData(response);
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/cvs/${id}`);
  }

  async adaptToJobOffer(id: string, jobOffer: string): Promise<SavedCVBackend> {
    const response = await axios.post<ApiResponse<SavedCVBackend>>(
      `/cvs/${id}/adapt`,
      { jobOffer }
    );
    return getResponseData(response);
  }

  async generateSuggestions(id: string): Promise<Suggestion[]> {
    const response = await axios.post<ApiResponse<Suggestion[]>>(`/cvs/${id}/suggestions`);
    return getResponseData(response);
  }

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
