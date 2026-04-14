import { v4 as uuidv4 } from 'uuid';
import { Profile } from '../../entities/Profile';
import { IProfileRepository } from '../../repositories/IProfileRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { ConflictError, NotFoundError, BadRequestError } from '../../errors/AppError';

export interface CreateProfileDTO {
  userId: string;
  fullName: string;
  title: string;
  summary?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills?: string[];
}

export class CreateProfileUseCase {
  constructor(
    private readonly profileRepository: IProfileRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreateProfileDTO): Promise<Profile> {
    // Validaciones
    if (!dto.userId || !dto.fullName || !dto.title) {
      throw new BadRequestError('userId, fullName y title son requeridos');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    // Verificar que el usuario no tenga ya un perfil
    const existingProfile = await this.profileRepository.findByUserId(dto.userId);
    if (existingProfile) {
      throw new ConflictError('El usuario ya tiene un perfil creado');
    }

    // Crear perfil
    const profile = new Profile({
      id: uuidv4(),
      userId: dto.userId,
      fullName: dto.fullName,
      title: dto.title,
      summary: dto.summary,
      phone: dto.phone,
      website: dto.website,
      linkedin: dto.linkedin,
      github: dto.github,
      skills: dto.skills || [],
      isPublic: true,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Guardar en BD
    return await this.profileRepository.save(profile);
  }
}
