import { PrismaClient, Profile as PrismaProfile } from '@prisma/client';
import { Profile, IProfileRepository, ProfileFilters } from '../../domain';

export class PrismaProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Mapper: Prisma → Domain
  private toDomain(prismaProfile: PrismaProfile): Profile {
    return new Profile({
      id: prismaProfile.id,
      userId: prismaProfile.userId,
      fullName: prismaProfile.fullName,
      title: prismaProfile.title,
      summary: prismaProfile.summary || undefined,
      phone: prismaProfile.phone || undefined,
      website: prismaProfile.website || undefined,
      linkedin: prismaProfile.linkedin || undefined,
      github: prismaProfile.github || undefined,
      skills: prismaProfile.skills,
      isPublic: prismaProfile.isPublic,
      views: prismaProfile.views,
      createdAt: prismaProfile.createdAt,
      updatedAt: prismaProfile.updatedAt,
    });
  }

  async findById(id: string): Promise<Profile | null> {
    const prismaProfile = await this.prisma.profile.findUnique({
      where: { id },
    });
    return prismaProfile ? this.toDomain(prismaProfile) : null;
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const prismaProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    return prismaProfile ? this.toDomain(prismaProfile) : null;
  }

  async findAll(filters?: ProfileFilters): Promise<Profile[]> {
    const where: any = {};

    if (filters?.isPublic !== undefined) {
      where.isPublic = filters.isPublic;
    }

    if (filters?.skills && filters.skills.length > 0) {
      where.skills = {
        hasSome: filters.skills,
      };
    }

    if (filters?.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { title: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const prismaProfiles = await this.prisma.profile.findMany({
      where,
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
      orderBy: { createdAt: 'desc' },
    });

    return prismaProfiles.map((p) => this.toDomain(p));
  }

  async save(profile: Profile): Promise<Profile> {
    const prismaProfile = await this.prisma.profile.upsert({
      where: { id: profile.id },
      update: {
        fullName: profile.fullName,
        title: profile.title,
        summary: profile.summary,
        phone: profile.phone,
        website: profile.website,
        linkedin: profile.linkedin,
        github: profile.github,
        skills: profile.skills,
        isPublic: profile.isPublic,
        views: profile.views,
        updatedAt: profile.updatedAt,
      },
      create: {
        id: profile.id,
        userId: profile.userId,
        fullName: profile.fullName,
        title: profile.title,
        summary: profile.summary,
        phone: profile.phone,
        website: profile.website,
        linkedin: profile.linkedin,
        github: profile.github,
        skills: profile.skills,
        isPublic: profile.isPublic,
        views: profile.views,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
    return this.toDomain(prismaProfile);
  }

  async update(id: string, data: Partial<Profile>): Promise<Profile> {
    const prismaProfile = await this.prisma.profile.update({
      where: { id },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.title && { title: data.title }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.linkedin !== undefined && { linkedin: data.linkedin }),
        ...(data.github !== undefined && { github: data.github }),
        ...(data.skills && { skills: data.skills }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
        updatedAt: new Date(),
      },
    });
    return this.toDomain(prismaProfile);
  }

  async incrementViews(id: string): Promise<void> {
    await this.prisma.profile.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.profile.delete({
      where: { id },
    });
  }
}
