import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';


@Injectable()
export class WishlistsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateWishlistDto) {
		return this.prisma.wishlist.create({ data });
	}

	async findAll() {
		return this.prisma.wishlist.findMany({ include: { user: true, project: true } });
	}

	async findOne(id: number) {
		const wishlist = await this.prisma.wishlist.findUnique({ where: { id }, include: { user: true, project: true } });

		if (!wishlist) {
			throw new NotFoundException(`Wishlist with ID ${id} not found`);
		}

		return wishlist;
	}

	async update(id: number, data: UpdateWishlistDto) {
		return this.prisma.wishlist.update({ where: { id }, data });
	}

	async remove(id: number) {
		return this.prisma.wishlist.delete({ where: { id } });
	}
}
