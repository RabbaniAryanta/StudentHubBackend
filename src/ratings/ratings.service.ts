import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    if (!data.projectId) throw new BadRequestException('projectId is required');
    if (!data.score) throw new BadRequestException('score is required');
    if (data.score < 1 || data.score > 5) throw new BadRequestException('score must be between 1 and 5');

    const project = await this.prisma.project.findUnique({ where: { id: Number(data.projectId) } });
    if (!project) throw new NotFoundException(`Project with id ${data.projectId} not found`);

    const user = await this.prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const existingRating = await this.prisma.rating.findFirst({
      where: { projectId: Number(data.projectId), userId: Number(userId) },
    });
    if (existingRating) throw new ConflictException(`User with id ${userId} has already rated this project`);

    const rating = await this.prisma.rating.create({
      data: {
        ...data,
        projectId: Number(data.projectId),
        userId: Number(userId),
      },
    });

    const agg = await this.prisma.rating.aggregate({
      where: { projectId: Number(data.projectId) },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.project.update({
      where: { id: Number(data.projectId) },
      data: {
        averageRating: agg._avg.score || 0,
        totalReviews: agg._count.score || 0,
      },
    });

    return rating;
  }

  async findByProject(projectId: number) {
    const project = await this.prisma.project.findUnique({ where: { id: Number(projectId) } });
    if (!project) throw new NotFoundException(`Project with id ${projectId} not found`);

    return await this.prisma.rating.findMany({
      where: { projectId: Number(projectId) },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }
}