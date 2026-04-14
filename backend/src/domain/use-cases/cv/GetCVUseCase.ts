import { CV } from '../../entities/CV';
import { ICVRepository } from '../../repositories/ICVRepository';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';

export class GetCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(cvId: string, userId?: string): Promise<CV> {
    const cv = await this.cvRepository.findById(cvId);

    if (!cv) {
      throw new NotFoundError('CV');
    }

    // Solo el dueño puede ver el CV (por ahora - marketplace después)
    if (cv.userId !== userId) {
      throw new ForbiddenError('No tienes permiso para ver este CV');
    }

    return cv;
  }
}
