import { CV, Suggestion } from '../../entities/CV';
import { ICVRepository } from '../../repositories/ICVRepository';
import { GeminiService } from '../../../infrastructure/services/GeminiService';
import { NotFoundError } from '../../errors/AppError';

export class GenerateSuggestionsUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly geminiService: GeminiService
  ) {}

  async execute(cvId: string): Promise<Suggestion[]> {
    // Buscar CV
    const cv = await this.cvRepository.findById(cvId);

    if (!cv) {
      throw new NotFoundError('CV');
    }

    // Generar sugerencias con Gemini
    const suggestions = await this.geminiService.generateSuggestions(cv.cvData);

    // Actualizar CV con sugerencias
    await this.cvRepository.update(cvId, { suggestions });

    return suggestions;
  }
}
