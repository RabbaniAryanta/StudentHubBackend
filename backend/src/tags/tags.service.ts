import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: Prisma.TagCreateInput) {
		return this.prisma.tag.create({ data });
	}

	async findAll() {
		return this.prisma.tag.findMany({ include: { projects: true } });
	}

	async findOne(id: number) {
		const tag = await this.prisma.tag.findUnique({ where: { id }, include: { projects: true } });

		if (!tag) {
			throw new NotFoundException(`Tag with ID ${id} not found`);
		}

		return tag;
	}

	async update(id: number, data: Prisma.TagUpdateInput) {
		return this.prisma.tag.update({ where: { id }, data });
	}

	async remove(id: number) {
		return this.prisma.tag.delete({ where: { id } });
	}
}
