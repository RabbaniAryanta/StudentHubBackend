import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMajorDto } from './dto/create-majors.dto';
import { UpdateMajorDto } from './dto/update-majors.dto';


@Injectable()
export class MajorsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateMajorDto) {
		return this.prisma.major.create({ data });
	}

	async findAll() {
		return this.prisma.major.findMany({ include: { students: true } });
	}

	async findOne(id: number) {
		const major = await this.prisma.major.findUnique({ where: { id }, include: { students: true } });

		if (!major) {
			throw new NotFoundException(`Major with ID ${id} not found`);
		}

		return major;
	}

	async update(id: number, data: UpdateMajorDto) {
		return this.prisma.major.update({ where: { id }, data });
	}

	async remove(id: number) {
		return this.prisma.major.delete({ where: { id } });
	}
}
