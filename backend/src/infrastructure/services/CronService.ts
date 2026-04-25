import cron from 'node-cron';
import { prisma } from '../database/prisma/PrismaClient';
import { EmailService } from './EmailService';

export class CronService {
  private prisma = prisma;
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Inicia todos los cron jobs
   */
  start() {
    console.log('⏰ Iniciando cron jobs...');

    // Ejecutar cada día a las 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('🔔 Ejecutando tarea: Recordatorios de actualización de CV');
      await this.sendCVUpdateReminders();
    });

    // Limpiar CVs temporales cada semana (domingos a las 2:00 AM)
    cron.schedule('0 2 * * 0', async () => {
      console.log('🧹 Ejecutando tarea: Limpieza de CVs temporales');
      await this.cleanTemporaryCVs();
    });

    console.log('✅ Cron jobs iniciados correctamente');
  }

  /**
   * Enviar recordatorios a usuarios con CVs sin actualizar por 90 días
   */
  private async sendCVUpdateReminders() {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      // Buscar CVs no actualizados en 90 días
      const oldCVs = await this.prisma.cV.findMany({
        where: {
          updatedAt: {
            lt: ninetyDaysAgo,
          },
        },
        include: {
          user: true,
        },
      });

      console.log(`📧 Enviando ${oldCVs.length} recordatorios...`);

      for (const cv of oldCVs) {
        await this.emailService.sendCVUpdateReminder(
          cv.user.email,
          cv.user.username || cv.user.email,
          cv.title
        );
      }

      console.log(`✅ ${oldCVs.length} recordatorios enviados`);
    } catch (error) {
      console.error('❌ Error enviando recordatorios:', error);
    }
  }

  /**
   * Limpiar CVs temporales (sin título definido y > 7 días)
   */
  private async cleanTemporaryCVs() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await this.prisma.cV.deleteMany({
        where: {
          title: {
            contains: 'Temporal',
          },
          createdAt: {
            lt: sevenDaysAgo,
          },
        },
      });

      console.log(`🗑️ ${result.count} CVs temporales eliminados`);
    } catch (error) {
      console.error('❌ Error limpiando CVs temporales:', error);
    }
  }
}