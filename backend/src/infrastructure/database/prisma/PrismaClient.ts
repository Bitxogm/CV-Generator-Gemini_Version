import { PrismaClient } from '@prisma/client';

export class PrismaClientSingleton {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log:
          process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      });
    }
    return PrismaClientSingleton.instance;
  }

  // Helper para cerrar conexión (útil en tests)
  public static async disconnect(): Promise<void> {
    if (PrismaClientSingleton.instance) {
      await PrismaClientSingleton.instance.$disconnect();
    }
  }
}

export const prisma = PrismaClientSingleton.getInstance();
