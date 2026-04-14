import { Profile } from '../../entities/Profile';
import { IProfileRepository } from '../../repositories/IProfileRepository';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';

export class GetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(profileId: string, incrementView: boolean = true): Promise<Profile> {
    // Buscar perfil
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundError('Perfil');
    }

    // Verificar si es público
    if (!profile.isPublic) {
      throw new ForbiddenError('Este perfil no está disponible públicamente');
    }

    // Incrementar vistas (opcional)
    if (incrementView) {
      await this.profileRepository.incrementViews(profileId);
    }

    return profile;
  }
}
