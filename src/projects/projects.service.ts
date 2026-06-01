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
    
    if (files.thumbnail && files.thumbnail.length > 0) {
      const result = await this.cloudinaryService.uploadImage(files.thumbnail[0]);
      thumbnailUrl = result.secure_url;
    }

    if (files.mediaUrls && files.mediaUrls.length > 0) {
      for (const file of files.mediaUrls) {
        const result = await this.cloudinaryService.uploadImage(file);
        mediaUrls.push(result.secure_url);
      }
    }

    const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = `${baseSlug}-${Date.now()}`;

    const categoryId = parseInt(data.categoryId, 10);
    const price = data.price ? parseFloat(data.price) : 0;

    const studentInput = data.studentId || data.students;
    let studentConnections: any = undefined;
    if (studentInput) {
      try {
        const parsed = typeof studentInput === 'string' ? JSON.parse(studentInput) : studentInput;
        if (Array.isArray(parsed)) {
          studentConnections = parsed.map((s: any) => ({ id: Number(s.id || s) }));
        } else {
          studentConnections = [{ id: Number(studentInput) }];
        }
      } catch (e) {
        studentConnections = [{ id: parseInt(studentInput, 10) }];
      }
    }

    let tagConnections: any = undefined;
    if (data.tags !== undefined) {
      try {
        const parsed = typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags;
        if (Array.isArray(parsed)) {
          tagConnections = parsed.map((t: any) => ({ tagId: Number(t.id || t.tagId || t) }));
        } else if (parsed) {
          tagConnections = [{ tagId: Number(parsed) }];
        }
      } catch (e) {
        if (data.tags) {
          tagConnections = [{ tagId: parseInt(data.tags, 10) }];
        }
      }
    }

    const { tags, ...restData } = data;

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
        ...(studentConnections && { students: { connect: studentConnections } }),
        ...(tagConnections && { tags: { create: tagConnections } }),
      },
      include: {
        students: true,
        category: true,
        tags: { include: { tag: true } }
      }
    });
  }

  async findAllPublished() {
    return this.prisma.project.findMany({
      where: {
        status: ProjectStatus.PUBLISHED,
      },
      include: {
        category: true,
        students: true,
        tags: { include: { tag: true } }
      },
    });
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        category: true,
        students: true,
        tags: { include: { tag: true } }
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug '${slug}' not found`);
    }

    return project;
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        category: true,
        students: {
          include: {
            major: true,
            batch: true
          }
        },
        tags: { include: { tag: true } }
      },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        students: {
          include: {
            major: true,
            batch: true
          }
        },
        tags: { include: { tag: true } }
      },
    });
    if (!project) throw new NotFoundException(`Project with id ${id} not found`);
    return project;
  }

  async update(id: number, data: any, files?: { thumbnail?: Express.Multer.File[], mediaUrls?: Express.Multer.File[] }) {
    let thumbnailUrl = data.thumbnail;
    let mediaUrls = data.mediaUrls;
    
    if (files) {
      if (files.thumbnail && files.thumbnail.length > 0) {
        const result = await this.cloudinaryService.uploadImage(files.thumbnail[0]);
        thumbnailUrl = result.secure_url;
      }
      if (files.mediaUrls && files.mediaUrls.length > 0) {
        mediaUrls = [];
        for (const file of files.mediaUrls) {
          const result = await this.cloudinaryService.uploadImage(file);
          mediaUrls.push(result.secure_url);
        }
      }
    }

    const updateData: any = {
      ...data,
      thumbnail: thumbnailUrl,
    };
    
    // Hapus key yang bisa bikin error dari spread operator (FormData biasanya mengirim string)
    delete updateData.studentId;
    delete updateData.students;
    
    if (mediaUrls) {
      updateData.mediaUrls = mediaUrls;
    }
    
    if (data.categoryId) updateData.categoryId = parseInt(data.categoryId, 10);
    
    const studentInput = data.studentId || data.students;
    if (studentInput) {
      let studentConnections: any;
      try {
        const parsed = typeof studentInput === 'string' ? JSON.parse(studentInput) : studentInput;
        if (Array.isArray(parsed)) {
          studentConnections = parsed.map((s: any) => ({ id: Number(s.id || s) }));
        } else {
          studentConnections = [{ id: Number(studentInput) }];
        }
      } catch (e) {
        studentConnections = [{ id: parseInt(studentInput, 10) }];
      }
      updateData.students = { set: studentConnections };
    }
    
    if (data.price) updateData.price = parseFloat(data.price);

    if (data.tags !== undefined) {
      let tagConnections: any[] = [];
      try {
        const parsed = typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags;
        if (Array.isArray(parsed)) {
          tagConnections = parsed.map((t: any) => ({ tagId: Number(t.id || t.tagId || t) }));
        } else if (parsed) {
          tagConnections = [{ tagId: Number(parsed) }];
        }
      } catch (e) {
        if (data.tags) {
          tagConnections = [{ tagId: parseInt(data.tags, 10) }];
        }
      }
      
      updateData.tags = {
        deleteMany: {},
        create: tagConnections
      };
    }

    return this.prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        students: true,
        category: true,
        tags: { include: { tag: true } }
      }
    });
  }

  async remove(id: number) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
