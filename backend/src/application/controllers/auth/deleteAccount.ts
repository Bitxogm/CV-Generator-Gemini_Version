import { Request, Response } from 'express';
import { EmailService } from '../../../infrastructure/services/EmailService';
import { BadRequestError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const emailService = new EmailService();

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  if (!userId) {
    throw new BadRequestError('Usuario no autenticado');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, username: true },
  });

  if (!user) {
    throw new BadRequestError('Usuario no encontrado');
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  try {
    await emailService.sendAccountDeletedEmail(user.email, user.username);
    console.log(`✅ Email de cuenta eliminada enviado a: ${user.email}`);
  } catch (emailError) {
    console.error('⚠️ Error enviando email de cuenta eliminada:', emailError);
  }

  res.status(200).json({
    success: true,
    message: 'Cuenta eliminada correctamente',
  });
});
