import { Profile, ProfileProps } from '../../entities/Profile';
import { IProfileRepository } from '../../repositories/IProfileRepository';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../errors/AppError';

export interface UpdateProfileDTO {
  profileId: string;
  userId: string; // Para verificar ownership
  fullName?: string;
  title?: string;
  summary?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills?: string[];
  isPublic?: boolean;
}

export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(dto: UpdateProfileDTO): Promise<Profile> {
    // Validaciones
    if (!dto.profileId || !dto.userId) {
      throw new BadRequestError('profileId y userId son requeridos');
    }

    // Buscar perfil
    const profile = await this.profileRepository.findById(dto.profileId);
    if (!profile) {
      throw new NotFoundError('Perfil');
    }

    // Verificar ownership
    if (profile.userId !== dto.userId) {
      throw new ForbiddenError('No puedes editar este perfil');
    }

    // Actualizar
    const updateData: Partial<ProfileProps> = {};
    if (dto.fullName) updateData.fullName = dto.fullName;
    if (dto.title) updateData.title = dto.title;
    if (dto.summary !== undefined) updateData.summary = dto.summary;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.website !== undefined) updateData.website = dto.website;
    if (dto.linkedin !== undefined) updateData.linkedin = dto.linkedin;
    if (dto.github !== undefined) updateData.github = dto.github;
    if (dto.skills) updateData.skills = dto.skills;
    if (dto.isPublic !== undefined) updateData.isPublic = dto.isPublic;

    return await this.profileRepository.update(dto.profileId, updateData);
  }
}
