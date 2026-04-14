import { PrismaClient, CV as PrismaCV } from '@prisma/client';
import { CV, ICVRepository, CVFilters } from '../../domain';

export class PrismaCVRepository implements ICVRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Mapper: Prisma → Domain
  private toDomain(prismaCV: PrismaCV): CV {
    return new CV({
      id: prismaCV.id,
      userId: prismaCV.userId,
      title: prismaCV.title,
      cvData: prismaCV.cvData as any, // Prisma Json → CVData
      pdfUrl: prismaCV.pdfUrl || undefined,
      jobOffer: prismaCV.jobOffer ? (prismaCV.jobOffer as any) : undefined,
      coverLetter: prismaCV.coverLetter || undefined,
      suggestions: (prismaCV.suggestions as any[]) || [],
      createdAt: prismaCV.createdAt,
      updatedAt: prismaCV.updatedAt,
    });
  }

  async findById(id: string): Promise<CV | null> {
    const prismaCV = await this.prisma.cV.findUnique({
      where: { id },
    });
    return prismaCV ? this.toDomain(prismaCV) : null;
  }

  async findByUserId(userId: string, filters?: CVFilters): Promise<CV[]> {
    const where: any = { userId };

    if (filters?.hasJobOffer !== undefined) {
      where.jobOffer = filters.hasJobOffer ? { not: null } : null;
    }

    if (filters?.search) {
      where.title = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.updatedAt = 'desc';
    }

    const prismaCVs = await this.prisma.cV.findMany({
      where,
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
      orderBy,
    });

    return prismaCVs.map((cv) => this.toDomain(cv));
  }

  async save(cv: CV): Promise<CV> {
    const prismaCV = await this.prisma.cV.upsert({
      where: { id: cv.id },
      update: {
        title: cv.title,
        cvData: cv.cvData as any,
        pdfUrl: cv.pdfUrl,
        jobOffer: cv.jobOffer as any,
        coverLetter: cv.coverLetter,
        suggestions: cv.suggestions as any,
        updatedAt: cv.updatedAt,
      },
      create: {
        id: cv.id,
        userId: cv.userId,
        title: cv.title,
        cvData: cv.cvData as any,
        pdfUrl: cv.pdfUrl,
        jobOffer: cv.jobOffer as any,
        coverLetter: cv.coverLetter,
        suggestions: cv.suggestions as any,
        createdAt: cv.createdAt,
        updatedAt: cv.updatedAt,
      },
    });
    return this.toDomain(prismaCV);
  }

  async update(id: string, data: Partial<CV>): Promise<CV> {
    const prismaCV = await this.prisma.cV.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.cvData && { cvData: data.cvData as any }),
        ...(data.pdfUrl !== undefined && { pdfUrl: data.pdfUrl }),
        ...(data.jobOffer !== undefined && { jobOffer: data.jobOffer as any }),
        ...(data.coverLetter !== undefined && { coverLetter: data.coverLetter }),
        ...(data.suggestions && { suggestions: data.suggestions as any }),
        updatedAt: new Date(),
      },
    });
    return this.toDomain(prismaCV);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cV.delete({
      where: { id },
    });
  }
}
