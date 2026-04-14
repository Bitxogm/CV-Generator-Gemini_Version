import { CV, JobOfferData } from '../../entities/CV';
import { ICVRepository } from '../../repositories/ICVRepository';
import { GeminiService } from '../../../infrastructure/services/GeminiService';
import { NotFoundError, BadRequestError } from '../../errors/AppError';

export interface GenerateCoverLetterDTO {
  cvId: string;
  jobOffer: JobOfferData;
}

export class GenerateCoverLetterUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly geminiService: GeminiService
  ) {}

  async execute(dto: GenerateCoverLetterDTO): Promise<{ coverLetter: string }> {
    // Buscar CV
    const cv = await this.cvRepository.findById(dto.cvId);

    if (!cv) {
      throw new NotFoundError('CV');
    }

    if (!dto.jobOffer) {
      throw new BadRequestError('Información de la oferta es requerida');
    }

    // Generar carta con Gemini
    const coverLetter = await this.geminiService.generateCoverLetter(cv.cvData, dto.jobOffer);

    // Actualizar CV con carta
    await this.cvRepository.update(dto.cvId, { coverLetter });

    return { coverLetter };
  }
}
