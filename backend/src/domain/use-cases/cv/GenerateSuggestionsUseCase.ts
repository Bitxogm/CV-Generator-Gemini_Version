import { Suggestion } from '../../entities/CV';
import { ICVRepository } from '../../repositories/ICVRepository';
import { GeminiService } from '../../../infrastructure/services/GeminiService';
import { NotFoundError, UnauthorizedError } from '../../errors/AppError';

export interface GenerateSuggestionsDTO {
  cvId: string;
  userId: string;
}

export class GenerateSuggestionsUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly geminiService: GeminiService
  ) {}

  async execute(dto: GenerateSuggestionsDTO): Promise<Suggestion[]> {
    const cv = await this.cvRepository.findById(dto.cvId);

    if (!cv) {
      throw new NotFoundError('CV');
    }

    if (cv.userId !== dto.userId) {
      throw new UnauthorizedError('No tienes permiso para modificar este CV');
    }

    // Generar sugerencias con Gemini
    const suggestions = await this.geminiService.generateSuggestions(cv.cvData);

    // Actualizar CV con sugerencias
    await this.cvRepository.update(dto.cvId, { suggestions });

    return suggestions;
  }
}
