import { v4 as uuidv4 } from 'uuid';
import { CV, CVData } from '../../entities/CV';
import { ICVRepository } from '../../repositories/ICVRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { NotFoundError, BadRequestError } from '../../errors/AppError';

export interface CreateCVDTO {
  userId: string;
  title: string;
  cvData: CVData;
}

export class CreateCVUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreateCVDTO): Promise<CV> {
    // Validaciones
    if (!dto.userId || !dto.title || !dto.cvData) {
      throw new BadRequestError('userId, title y cvData son requeridos');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    // Validar estructura mínima del CV
    if (!dto.cvData.personalInfo || !dto.cvData.personalInfo.fullName) {
      throw new BadRequestError('El CV debe tener al menos información personal básica');
    }

    // Crear CV
    const cv = new CV({
      id: uuidv4(),
      userId: dto.userId,
      title: dto.title,
      cvData: dto.cvData,
      suggestions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Guardar en BD
    return await this.cvRepository.save(cv);
  }
}
