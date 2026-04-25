import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../application/server';
import { prisma } from '../../infrastructure/database/prisma/PrismaClient';
import bcrypt from 'bcryptjs';

describe('Profile Endpoints Integration Tests', () => {
  let authToken: string;
  let userId: string;
  let profileId: string;

  beforeAll(async () => {
    // Limpiar y crear usuario de test
    await prisma.user.deleteMany({
      where: { email: 'profile-test@test.com' },
    });

    const hashedPassword = await bcrypt.hash('Test123!', 10);
    const user = await prisma.user.create({
      data: {
        email: 'profile-test@test.com',
        username: 'ProfileTestUser',
        password: hashedPassword,
      },
    });

    userId = user.id;

    // Login para obtener token
    const response = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'profile-test@test.com',
        password: 'Test123!',
      });

    authToken = response.body.data.token;
  });

  describe('POST /api/profile', () => {
    it('debe crear un perfil correctamente', async () => {
      const response = await request(app)
        .post('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'Test User Profile',
          title: 'Full Stack Developer',
          summary: 'Experienced developer',
          phone: '+34600000000',
          skills: ['JavaScript', 'TypeScript', 'React'],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.fullName).toBe('Test User Profile');

      profileId = response.body.data.id;
    });

    it('debe retornar 401 sin token', async () => {
      const response = await request(app)
        .post('/api/profile')
        .send({
          fullName: 'Test',
          title: 'Dev',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/profile/me', () => {
    it('debe obtener mi perfil', async () => {
      const response = await request(app)
        .get('/api/profile/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Test User Profile');
    });

    it('debe retornar 401 sin token', async () => {
      const response = await request(app)
        .get('/api/profile/me');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/profile/:id', () => {
    it('debe actualizar el perfil', async () => {
      const response = await request(app)
        .put(`/api/profile/${profileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'Updated Test User',
          title: 'Senior Full Stack Developer',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Updated Test User');
      expect(response.body.data.title).toBe('Senior Full Stack Developer');
    });
  });
});