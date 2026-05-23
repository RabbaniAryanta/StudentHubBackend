import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RatingsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: Prisma.RatingUncheckedCreateInput) {
		return this.prisma.rating.create({ data });
	}

	async findAll() {
		return this.prisma.rating.findMany({ include: { user: true, project: true } });
	}

	async findOne(id: number) {
		const rating = await this.prisma.rating.findUnique({ where: { id }, include: { user: true, project: true } });

		if (!rating) {
			throw new NotFoundException(`Rating with ID ${id} not found`);
		}

		return rating;
	}

	async update(id: number, data: Prisma.RatingUncheckedUpdateInput) {
		return this.prisma.rating.update({ where: { id }, data });
	}

	async remove(id: number) {
		return this.prisma.rating.delete({ where: { id } });
	}
}
