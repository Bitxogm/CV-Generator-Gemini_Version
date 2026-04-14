import { ICVRepository } from '../../repositories/ICVRepository';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';

export class DeleteCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(cvId: string, userId: string): Promise<void> {
    // Verificar que existe
    const cv = await this.cvRepository.findById(cvId);

    if (!cv) {
      throw new NotFoundError('CV');
    }

    // Verificar ownership
    if (cv.userId !== userId) {
      throw new ForbiddenError('No tienes permiso para eliminar este CV');
    }

    await this.cvRepository.delete(cvId);
  }
}
