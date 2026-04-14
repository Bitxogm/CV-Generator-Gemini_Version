import { User, UserProps } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { JWTService } from '../../../infrastructure/services/JWTService';
import { UnauthorizedError, BadRequestError } from '../../errors/AppError';

export interface SignInDTO {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: Omit<UserProps, 'passwordHash'>;
  token: string;
}

export class SignInUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JWTService
  ) {}

  async execute(dto: SignInDTO): Promise<SignInResponse> {
    // Validaciones
    if (!dto.email || !dto.password) {
      throw new BadRequestError('Email y password son requeridos');
    }

    // Buscar usuario
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Email o contraseña incorrectos');
    }

    // Verificar si está activo
    if (!user.isActive) {
      throw new UnauthorizedError('Tu cuenta está inactiva. Contacta con soporte');
    }

    // Verificar password
    const isPasswordValid = await this.jwtService.comparePasswords(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Email o contraseña incorrectos');
    }

    // Generar token
    const token = this.jwtService.generateToken(user);

    // Retornar usuario sin password
    return {
      user: user.toJSON(),
      token,
    };
  }
}
