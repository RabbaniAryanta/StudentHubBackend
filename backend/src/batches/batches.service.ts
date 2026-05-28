import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batches.dto';
import { UpdateBatchDto } from './dto/update-batches.dto';


@Injectable()
export class BatchesService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateBatchDto) {
		return this.prisma.batch.create({ data });
	}

	async findAll() {
		return this.prisma.batch.findMany({ include: { students: true } });
	}

	async findOne(id: number) {
		const batch = await this.prisma.batch.findUnique({ where: { id }, include: { students: true } });

		if (!batch) {
			throw new NotFoundException(`Batch with ID ${id} not found`);
		}

		return batch;
	}

	async update(id: number, data: UpdateBatchDto) {
		return this.prisma.batch.update({ where: { id }, data });
	}

	async remove(id: number) {
		return this.prisma.batch.delete({ where: { id } });
	}
}
