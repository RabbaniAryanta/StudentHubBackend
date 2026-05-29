import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto.name) throw new BadRequestException('name is required');
    if (!createCategoryDto.slug) throw new BadRequestException('slug is required');

    const existingName = await this.prisma.category.findFirst({ where: { name: createCategoryDto.name } });
    if (existingName) throw new ConflictException(`Category with name "${createCategoryDto.name}" already exists`);

    const existingSlug = await this.prisma.category.findFirst({ where: { slug: createCategoryDto.slug } });
    if (existingSlug) throw new ConflictException(`Category with slug "${createCategoryDto.slug}" already exists`);

    return await this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: Number(id) },
      include: { projects: true },
    });
    if (!category) throw new NotFoundException(`Category with id ${id} not found`);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category) throw new NotFoundException(`Category with id ${id} not found`);

    if (updateCategoryDto.name) {
      const existingName = await this.prisma.category.findFirst({
        where: { name: updateCategoryDto.name, NOT: { id: Number(id) } },
      });
      if (existingName) throw new ConflictException(`Category with name "${updateCategoryDto.name}" already exists`);
    }

    if (updateCategoryDto.slug) {
      const existingSlug = await this.prisma.category.findFirst({
        where: { slug: updateCategoryDto.slug, NOT: { id: Number(id) } },
      });
      if (existingSlug) throw new ConflictException(`Category with slug "${updateCategoryDto.slug}" already exists`);
    }

    return await this.prisma.category.update({
      where: { id: Number(id) },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: Number(id) },
      include: { projects: true },
    });
    if (!category) throw new NotFoundException(`Category with id ${id} not found`);
    if (category.projects.length > 0) {
      throw new BadRequestException(`Cannot delete category "${category.name}" because it still has ${category.projects.length} project(s) attached`);
    }

    return await this.prisma.category.delete({
      where: { id: Number(id) },
    });
  }
}