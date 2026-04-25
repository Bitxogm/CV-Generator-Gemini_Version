import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../application/server';
import { prisma } from '../../infrastructure/database/prisma/PrismaClient';
import bcrypt from 'bcryptjs';

describe('Job Endpoints Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    // Limpiar y crear usuario de test
    await prisma.user.deleteMany({
      where: { email: 'job-test@test.com' },
    });

    const hashedPassword = await bcrypt.hash('Test123!', 10);
    await prisma.user.create({
      data: {
        email: 'job-test@test.com',
        username: 'JobTestUser',
        password: hashedPassword,
      },
    });

    // Login para obtener token
    const response = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'job-test@test.com',
        password: 'Test123!',
      });

    authToken = response.body.data.token;
  });

 describe('POST /api/jobs/extract-from-url', () => {
    it.skip('debe extraer información de URL válida', async () => {
      // SKIP: Requiere URL real que funcione
      // TODO: Mockear JobScraperService en el futuro
      const response = await request(app)
        .post('/api/jobs/extract-from-url')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'https://www.tecnoempleo.com/oferta-ejemplo',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    }, 20000);

    it('debe retornar 400 sin URL', async () => {
      const response = await request(app)
        .post('/api/jobs/extract-from-url')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('URL');
    });

    it('debe retornar 400 con URL inválida', async () => {
      const response = await request(app)
        .post('/api/jobs/extract-from-url')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'not-a-valid-url',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('inválida');
    });

    it('debe retornar 401 sin token', async () => {
      const response = await request(app)
        .post('/api/jobs/extract-from-url')
        .send({
          url: 'https://www.tecnoempleo.com/oferta-ejemplo',
        });

      expect(response.status).toBe(401);
    });
  });
});