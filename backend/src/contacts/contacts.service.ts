import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContactsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: Prisma.ContactCreateInput) {
		return this.prisma.contact.create({ data });
	}

	async findAll() {
		return this.prisma.contact.findMany();
	}

	async findOne(id: number) {
		const contact = await this.prisma.contact.findUnique({ where: { id } });

		if (!contact) {
			throw new NotFoundException(`Contact with ID ${id} not found`);
		}

		return contact;
	}

	async update(id: number, data: Prisma.ContactUpdateInput) {
		return this.prisma.contact.update({ where: { id }, data });
	}

	async remove(id: number) {
		return this.prisma.contact.delete({ where: { id } });
	}
}
