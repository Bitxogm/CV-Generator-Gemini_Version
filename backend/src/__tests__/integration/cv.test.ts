import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../application/server";
import { prisma } from "../../infrastructure/database/prisma/PrismaClient";
import bcrypt from "bcryptjs";

describe("CV Endpoints Integration Tests", () => {
  let authToken: string;
  let userId: string;
  let cvId: string;

  beforeAll(async () => {
    // 1. Limpiar usuario de test si existe
    await prisma.user.deleteMany({
      where: { email: "test-integration@test.com" },
    });

    // 2. Crear usuario de test
    const hashedPassword = await bcrypt.hash("Test123!", 10);
    const user = await prisma.user.create({
      data: {
        email: "test-integration@test.com",
        username: "TestUser",
        password: hashedPassword,
      },
    });

    userId = user.id;

    // 3. Login para obtener token
    const response = await request(app).post("/api/auth/signin").send({
      email: "test-integration@test.com",
      password: "Test123!",
    });

    authToken = response.body.data.token;
  });

  describe("GET /api/cvs", () => {
    it("debe devolver lista de CVs del usuario autenticado", async () => {
      const response = await request(app)
        .get("/api/cvs")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("debe retornar 401 sin token", async () => {
      const response = await request(app).get("/api/cvs");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/cvs", () => {
    it("debe crear un CV correctamente", async () => {
      const newCV = {
        title: "Test CV Integration",
        cvData: {
          personalInfo: {
            fullName: "Test User",
            email: "test@test.com",
            phone: "123456789",
          },
          skills: ["JavaScript", "TypeScript"],
          experience: [],
          education: [],
        },
      };

      const response = await request(app)
        .post("/api/cvs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newCV);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.title).toBe(newCV.title);

      // Guardar ID para tests posteriores
      cvId = response.body.data.id;
    });

    it("debe retornar 400 sin datos requeridos", async () => {
      const response = await request(app)
        .post("/api/cvs")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/cvs/:id", () => {
    it("debe devolver un CV específico", async () => {
      // Primero crear uno
      const createResponse = await request(app)
        .post("/api/cvs")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test CV for GetById",
          cvData: {
            personalInfo: { fullName: "Test" },
            skills: [],
            experience: [],
            education: [],
          },
        });

      const testCvId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/cvs/${testCvId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testCvId);
    });
  });
});
