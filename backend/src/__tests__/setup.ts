import { beforeAll, afterAll, afterEach } from 'vitest';
import { prisma } from '../infrastructure/database/prisma/PrismaClient';

beforeAll(async () => {
  console.log('🧪 Setup: Conectando a test database...');
});

afterEach(async () => {
  // Limpiar datos después de cada test (opcional)
  // await prisma.cV.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
  console.log('✅ Teardown: Database disconnected');
});