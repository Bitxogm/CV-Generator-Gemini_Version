import { v4 as uuidv4 } from 'uuid';
import { User, UserProps, UserRole } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { JWTService } from '../../../infrastructure/services/JWTService';
import { ConflictError, BadRequestError } from '../../errors/AppError';

export interface SignUpDTO {
  email: string;
  username: string;
  password: string;
}

export interface SignUpResponse {
  user: Omit<UserProps, 'passwordHash'>;
  token: string;
}

export class SignUpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JWTService
  ) {}

  async execute(dto: SignUpDTO): Promise<SignUpResponse> {
    // Validaciones
    if (!dto.email || !dto.password || !dto.username) {
      throw new BadRequestError('Email, username y password son requeridos');
    }

    if (dto.password.length < 8) {
      throw new BadRequestError('La contraseña debe tener al menos 8 caracteres');
    }

    // Verificar si el usuario ya existe
    const existingUserByEmail = await this.userRepository.findByEmail(dto.email);
    if (existingUserByEmail) {
      throw new ConflictError('El email ya está registrado');
    }

    const existingUserByUsername = await this.userRepository.findByUsername(dto.username);
    if (existingUserByUsername) {
      throw new ConflictError('El username ya está en uso');
    }

    // Hash password
    const hashedPassword = await this.jwtService.hashPassword(dto.password);

    // Crear usuario
    const user = new User({
      id: uuidv4(),
      email: dto.email,
      username: dto.username,
      passwordHash: hashedPassword,
      role: UserRole.MEMBER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Guardar en BD
    const savedUser = await this.userRepository.save(user);

    // Generar token
    const token = this.jwtService.generateToken(savedUser);

    // Retornar usuario sin password
    return {
      user: savedUser.toJSON(),
      token,
    };
  }
}
