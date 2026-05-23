import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly bcryptService: BcryptService,
	) {}

	async create(data: Prisma.UserUncheckedCreateInput) {
		const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });

		if (existingUser) {
			throw new BadRequestException('User with this email already exists');
		}

		const hashedPassword = await this.bcryptService.hashPassword(data.password);

		return this.prisma.user.create({
			data: {
				...data,
				password: hashedPassword,
			},
		});
	}

	async findAll() {
		return this.prisma.user.findMany({
			include: { studentProfile: true, cart: true },
		});
	}

	async findOne(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: { studentProfile: true, cart: true },
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return user;
	}

	async findOneByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			include: { studentProfile: true, cart: true },
		});
	}

	async update(id: number, data: Prisma.UserUncheckedUpdateInput) {
		if (typeof data.email === 'string') {
			const existingUser = await this.prisma.user.findFirst({
				where: { email: data.email, NOT: { id } },
			});

			if (existingUser) {
				throw new BadRequestException('User with this email already exists');
			}
		}

		const nextData = { ...data } as Prisma.UserUncheckedUpdateInput;

		if (typeof nextData.password === 'string') {
			nextData.password = await this.bcryptService.hashPassword(nextData.password);
		}

		return this.prisma.user.update({ where: { id }, data: nextData });
	}

	async remove(id: number) {
		return this.prisma.user.delete({ where: { id } });
	}
}
