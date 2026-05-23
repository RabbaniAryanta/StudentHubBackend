import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: Prisma.OrderUncheckedCreateInput) {
		return this.prisma.order.create({ data });
	}

	async findAll() {
		return this.prisma.order.findMany({
			include: { user: true, bankAccount: true, items: true, paymentProofs: true },
		});
	}

	async findOne(id: number) {
		const order = await this.prisma.order.findUnique({
			where: { id },
			include: { user: true, bankAccount: true, items: true, paymentProofs: true },
		});

		if (!order) {
			throw new NotFoundException(`Order with ID ${id} not found`);
		}

		return order;
	}

	async update(id: number, data: Prisma.OrderUncheckedUpdateInput) {
		return this.prisma.order.update({ where: { id }, data });
	}

	async remove(id: number) {
		return this.prisma.order.delete({ where: { id } });
	}
}
