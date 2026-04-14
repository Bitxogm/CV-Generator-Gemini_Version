import { IUserRepository } from '../../repositories/IUserRepository';
import { JWTService } from '../../../infrastructure/services/JWTService';
import { NotFoundError, BadRequestError } from '../../errors/AppError';

export interface RequestPasswordResetDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export class RecoverPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JWTService
  ) {}

  // Paso 1: Solicitar reset (genera token)
  async requestPasswordReset(
    dto: RequestPasswordResetDTO
  ): Promise<{ message: string; token?: string }> {
    if (!dto.email) {
      throw new BadRequestError('Email es requerido');
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      // Por seguridad, no revelar si el email existe
      return { message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña' };
    }

    // Generar token de reset
    const resetToken = this.jwtService.generateResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en usuario
    await this.userRepository.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    // TODO: Enviar email con el token (EmailService)
    // Por ahora, devolvemos el token (solo para desarrollo)
    return {
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña',
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    };
  }

  // Paso 2: Resetear password con token
  async resetPassword(dto: ResetPasswordDTO): Promise<{ message: string }> {
    if (!dto.token || !dto.newPassword) {
      throw new BadRequestError('Token y nueva contraseña son requeridos');
    }

    if (dto.newPassword.length < 8) {
      throw new BadRequestError('La contraseña debe tener al menos 8 caracteres');
    }

    // Buscar usuario por token
    const user = await this.userRepository.findByResetToken(dto.token);
    if (!user) {
      throw new NotFoundError('Token inválido o expirado');
    }

    // Hash nueva password
    const hashedPassword = await this.jwtService.hashPassword(dto.newPassword);

    // Actualizar password y limpiar token
    await this.userRepository.update(user.id, {
      passwordHash: hashedPassword,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
