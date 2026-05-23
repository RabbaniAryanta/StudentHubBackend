import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: Prisma.StudentUncheckedCreateInput) {
		return this.prisma.student.create({ data });
	}

	async findAll() {
		return this.prisma.student.findMany({
			include: { user: true, major: true, batch: true, projects: true },
		});
	}

	async findOne(id: number) {
		const student = await this.prisma.student.findUnique({
			where: { id },
			include: { user: true, major: true, batch: true, projects: true },
		});

		if (!student) {
			throw new NotFoundException(`Student with ID ${id} not found`);
		}

		return student;
	}

	async update(id: number, data: Prisma.StudentUncheckedUpdateInput) {
		return this.prisma.student.update({ where: { id }, data });
	}

	async remove(id: number) {
		return this.prisma.student.delete({ where: { id } });
	}
}
