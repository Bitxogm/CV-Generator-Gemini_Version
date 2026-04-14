import { CV } from '../../entities/CV';
import { ICVRepository, CVFilters } from '../../repositories/ICVRepository';

export class GetMyCVsUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(userId: string, filters?: CVFilters): Promise<CV[]> {
    return await this.cvRepository.findByUserId(userId, filters);
  }
}
