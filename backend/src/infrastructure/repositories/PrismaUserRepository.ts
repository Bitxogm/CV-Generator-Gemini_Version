import { PrismaClient, User as PrismaUser, Role as PrismaRole } from '@prisma/client';
import { User, UserRole, IUserRepository } from '../../domain';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Mapper: Prisma → Domain
  private toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      username: prismaUser.username,
      passwordHash: prismaUser.password,
      role: prismaUser.role as unknown as UserRole,
      isActive: prismaUser.isActive,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      passwordResetToken: prismaUser.passwordResetToken || undefined,
      passwordResetExpires: prismaUser.passwordResetExpires || undefined,
    });
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });
    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });
    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { username },
    });
    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findByResetToken(token: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gte: new Date(), // Token no expirado
        },
      },
    });
    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async save(user: User): Promise<User> {
    const prismaUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        username: user.username,
        password: user.passwordHash,
        role: user.role as unknown as PrismaRole,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
        passwordResetToken: user.passwordResetToken,
        passwordResetExpires: user.passwordResetExpires,
      },
      create: {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.passwordHash,
        role: user.role as unknown as PrismaRole,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return this.toDomain(prismaUser);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.username && { username: data.username }),
        ...(data.passwordHash && { password: data.passwordHash }),
        ...(data.role && { role: data.role as unknown as PrismaRole }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.passwordResetToken !== undefined && {
          passwordResetToken: data.passwordResetToken,
        }),
        ...(data.passwordResetExpires !== undefined && {
          passwordResetExpires: data.passwordResetExpires,
        }),
        updatedAt: new Date(),
      },
    });
    return this.toDomain(prismaUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
