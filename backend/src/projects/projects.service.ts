import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../helper/cloudinary.service';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(data: any, files: { thumbnail?: Express.Multer.File[], mediaUrls?: Express.Multer.File[] }, user: any) {
    let thumbnailUrl = null;
    let mediaUrls: string[] = [];
    
    // Upload thumbnail
    if (files.thumbnail && files.thumbnail.length > 0) {
      const result = await this.cloudinaryService.uploadImage(files.thumbnail[0]);
      thumbnailUrl = result.secure_url;
    }

    // Upload mediaUrls
    if (files.mediaUrls && files.mediaUrls.length > 0) {
      for (const file of files.mediaUrls) {
        const result = await this.cloudinaryService.uploadImage(file);
        mediaUrls.push(result.secure_url);
      }
    }

    // Generate a simple slug
    const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = `${baseSlug}-${Date.now()}`;

    const categoryId = parseInt(data.categoryId, 10);
    // Since only admins or system creates projects for students via contact for now,
    // let's just map studentId if provided or just create the project.
    const studentId = data.studentId ? parseInt(data.studentId, 10) : undefined;
    const price = data.price ? parseFloat(data.price) : 0;

    return this.prisma.project.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        price,
        thumbnail: thumbnailUrl,
        mediaUrls: mediaUrls,
        status: data.status || ProjectStatus.DRAFT,
        categoryId,
        ...(studentId && { studentId }),
      },
    });
  }

  async findAllPublished() {
    return this.prisma.project.findMany({
      where: {
        status: ProjectStatus.PUBLISHED,
      },
      include: {
        category: true,
        student: {
          include: {
            user: true, // Include related user data from student
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        category: true,
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug '${slug}' not found`);
    }

    return project;
  }
}
