import { CV, JobOfferData } from '../../entities/CV';
import { ICVRepository } from '../../repositories/ICVRepository';
import { GeminiService } from '../../../infrastructure/services/GeminiService';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';

export interface AdaptToJobOfferDTO {
  cvId: string;
  userId: string;
  jobOffer: JobOfferData;
}

export class AdaptToJobOfferUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly geminiService: GeminiService
  ) {}

  async execute(dto: AdaptToJobOfferDTO): Promise<CV> {
    // Buscar CV
    const cv = await this.cvRepository.findById(dto.cvId);

    if (!cv) {
      throw new NotFoundError('CV');
    }

    // Verificar ownership
    if (cv.userId !== dto.userId) {
      throw new ForbiddenError('No tienes permiso para modificar este CV');
    }

    // Adaptar con Gemini
    const adaptedCVData = await this.geminiService.adaptCVToJobOffer(cv.cvData, dto.jobOffer);

    // Actualizar CV con datos adaptados y oferta
    const updatedCV = await this.cvRepository.update(dto.cvId, {
      cvData: adaptedCVData,
      jobOffer: dto.jobOffer,
    });

    return updatedCV;
  }
}
