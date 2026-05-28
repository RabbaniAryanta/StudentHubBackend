import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tags.dto';
import { UpdateTagDto } from './dto/update-tags.dto';

@Injectable()
export class TagsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateTagDto) {
		if (!data.name) throw new BadRequestException('name is required');

		const existingName = await this.prisma.tag.findFirst({ where: { name: data.name } });
		if (existingName) throw new ConflictException(`Tag with name "${data.name}" already exists`);

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

	async update(id: number, data: UpdateTagDto) {
		const tag = await this.prisma.tag.findUnique({ where: { id } });
		if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);

		if (data.name) {
			const existingName = await this.prisma.tag.findFirst({
				where: { name: data.name, NOT: { id } },
			});
			if (existingName) throw new ConflictException(`Tag with name "${data.name}" already exists`);
		}

		return this.prisma.tag.update({ where: { id }, data });
	}

	async remove(id: number) {
		const tag = await this.prisma.tag.findUnique({
			where: { id },
			include: { projects: true },
		});
		if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
		
		if (tag.projects.length > 0) {
			throw new BadRequestException(`Cannot delete tag "${tag.name}" because it still has ${tag.projects.length} project(s) attached`);
		}

		return this.prisma.tag.delete({ where: { id } });
	}
}
