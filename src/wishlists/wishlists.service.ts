import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}

  async toggleWishlist(userId: number, createWishlistDto: CreateWishlistDto) {
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_projectId: {
          userId: Number(userId),
          projectId: Number(createWishlistDto.projectId),
        },
      },
    });

    if (existing) {
      // Remove from wishlist
      await this.prisma.$transaction(async (tx) => {
        await tx.wishlist.delete({ where: { id: existing.id } });
        await tx.project.update({
          where: { id: existing.projectId },
          data: { wishlistCount: { decrement: 1 } }
        });
      });
      return { message: 'Project removed from wishlist' };
    } else {
      // Add to wishlist
      await this.prisma.$transaction(async (tx) => {
        await tx.wishlist.create({
          data: {
            userId: Number(userId),
            projectId: Number(createWishlistDto.projectId),
          },
        });
        await tx.project.update({
          where: { id: Number(createWishlistDto.projectId) },
          data: { wishlistCount: { increment: 1 } }
        });
      });
      return { message: 'Project added to wishlist' };
    }
  }

  async findByUser(userId: number) {
    return await this.prisma.wishlist.findMany({
      where: { userId: Number(userId) },
      include: {
        project: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Check if a project is in the user's wishlist
  async checkStatus(userId: number, projectId: number) {
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_projectId: {
          userId: Number(userId),
          projectId: Number(projectId),
        },
      },
    });
    return { isWishlisted: !!existing };
  }
}
