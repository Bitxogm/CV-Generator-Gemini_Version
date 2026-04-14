import { Profile } from '../../entities/Profile';
import { IProfileRepository } from '../../repositories/IProfileRepository';
import { NotFoundError } from '../../errors/AppError';

export class GetMyProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string): Promise<Profile | null> {
    // Buscar perfil del usuario
    const profile = await this.profileRepository.findByUserId(userId);

    // Puede que no tenga perfil aún (null es válido)
    return profile;
  }
}
