import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../application/server';
import { prisma } from '../../infrastructure/database/prisma/PrismaClient';

describe('Auth Endpoints Integration Tests', () => {
  const testEmail = 'auth-test@test.com';
  
  beforeAll(async () => {
    // Limpiar usuario de test si existe
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
  });

  afterAll(async () => {
    // Limpiar después de tests
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
  });

  describe('POST /api/auth/signup', () => {
    it('debe crear un usuario correctamente', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testEmail,
          username: 'AuthTestUser',
          password: 'Test123!',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(testEmail);
    });

    it('debe retornar 400 sin datos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@test.com',
          // Falta username y password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('debe retornar 400 con email duplicado', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testEmail, // Ya existe del primer test
          username: 'AnotherUser',
          password: 'Test123!',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/signin', () => {
    it('debe hacer login correctamente', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testEmail,
          password: 'Test123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
    });

    it('debe retornar 401 con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testEmail,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('debe retornar 400 sin datos', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});