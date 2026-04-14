import { CV, CVData, CVProps, JobOfferData } from '../../entities/CV';
import { ICVRepository } from '../../repositories/ICVRepository';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';

export interface UpdateCVDTO {
  cvId: string;
  userId: string;
  title?: string;
  cvData?: CVData;
  jobOffer?: JobOfferData;
  coverLetter?: string;
  pdfUrl?: string;
}

export class UpdateCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(dto: UpdateCVDTO): Promise<CV> {
    // Verificar que existe
    const cv = await this.cvRepository.findById(dto.cvId);

    if (!cv) {
      throw new NotFoundError('CV');
    }

    // Verificar ownership
    if (cv.userId !== dto.userId) {
      throw new ForbiddenError('No tienes permiso para editar este CV');
    }

    // Actualizar (CVProps para evitar conflicto con propiedades readonly de CV)
    const updateData: Partial<CVProps> = {};
    if (dto.title) updateData.title = dto.title;
    if (dto.cvData) updateData.cvData = dto.cvData;
    if (dto.jobOffer !== undefined) updateData.jobOffer = dto.jobOffer;
    if (dto.coverLetter !== undefined) updateData.coverLetter = dto.coverLetter;
    if (dto.pdfUrl !== undefined) updateData.pdfUrl = dto.pdfUrl;

    return await this.cvRepository.update(dto.cvId, updateData);
  }
}
